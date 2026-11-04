// app/api/waitlist/route.ts
//
// Product waitlist signup. Adds the email as a Resend contact in the
// product's segment (set per product in Sanity as waitlistSegmentId).
// The client only sends a product slug — the segment is resolved here,
// server-side, so nobody can add themselves to an arbitrary list.
//
// Lists stay studio-owned: one segment per app, one shared "players"
// segment for games, separate from client/prospect contacts.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { PRODUCT_WAITLIST_QUERY } from "@/sanity/lib/queries";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9-]{1,64}$/;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { email, product, website } = body as {
    email?: unknown;
    product?: unknown;
    website?: unknown;
  };

  // Honeypot — hidden from people; anything here came from a bot.
  if (typeof website === "string" && website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  if (
    typeof email !== "string" ||
    !EMAIL_RE.test(email.trim()) ||
    email.length > 254
  ) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 },
    );
  }
  if (typeof product !== "string" || !SLUG_RE.test(product)) {
    return NextResponse.json({ error: "Unknown product." }, { status: 400 });
  }

  const target: {
    name: string;
    status: string;
    waitlistSegmentId?: string;
  } | null = await client
    .fetch(PRODUCT_WAITLIST_QUERY, { slug: product })
    .catch(() => null);

  if (!target?.waitlistSegmentId || target.status === "retired") {
    return NextResponse.json(
      { error: "This waitlist isn't open." },
      { status: 404 },
    );
  }

  const address = email.trim().toLowerCase();
  const segmentId = target.waitlistSegmentId;

  try {
    // Resend reports API failures in { error } rather than throwing.
    const { error } = await resend.contacts.create({
      email: address,
      segments: [{ id: segmentId }],
    });

    if (error) {
      // Already a contact (e.g. on another product's list) — add them
      // to this segment instead of failing the signup.
      const { error: addError } = await resend.contacts.segments.add({
        email: address,
        segmentId,
      });
      if (addError) {
        console.error("Waitlist signup failed:", error, addError);
        return NextResponse.json(
          { error: "Couldn't join the waitlist. Please try again." },
          { status: 500 },
        );
      }
    }
  } catch (err) {
    console.error("Waitlist signup threw:", err);
    return NextResponse.json(
      { error: "Couldn't join the waitlist. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
