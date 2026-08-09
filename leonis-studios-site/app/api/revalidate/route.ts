// app/api/revalidate/route.ts
//
// On-demand ISR endpoint. Sanity hits this URL whenever a document
// is created, updated, or deleted, so published changes show up
// immediately instead of waiting for the 1-hour revalidate window.
//
// The webhook is configured in Sanity's manage console to POST here
// with a shared secret — see SANITY_REVALIDATE_SECRET in .env.local.

import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    // Revalidate the whole route tree — the site is small enough
    // that per-type/per-path targeting isn't worth the complexity.
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, now: Date.now(), type: body._type });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
