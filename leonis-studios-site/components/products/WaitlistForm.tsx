"use client";

// "use client" — form state (email, submit status) and fetch on submit.
// Posts to /api/waitlist with the product slug; the server decides
// which list it lands on.

import { useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

type Status = "idle" | "sending" | "done" | "error";

export default function WaitlistForm({
  product,
  productName,
  pitch,
}: {
  product: string;
  productName: string;
  pitch?: string;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p
        role="status"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: tokens.weightUI,
          color: colors.accent,
          fontSize: tokens.fontSizes.body,
        }}
      >
        You&rsquo;re on the list. We&rsquo;ll email you when {productName}{" "}
        launches.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-lg" noValidate>
      {pitch && (
        <p
          className="mb-3"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            color: colors.textSecondaryLight,
            fontSize: "15px",
          }}
        >
          {pitch}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`waitlist-${product}`} className="sr-only">
          Email address
        </label>
        <input
          id={`waitlist-${product}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-5 py-4 text-base outline-none"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            background: colors.surfaceDark,
            color: colors.textPrimary,
            border: `1px solid ${colors.borderDark}`,
          }}
        />
        {/* Honeypot — off-screen, skipped by keyboard and screen readers */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{
            position: "absolute",
            left: "-10000px",
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-7 py-4 text-sm tracking-widest uppercase transition-opacity duration-200 disabled:opacity-60"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: tokens.weightUI,
            background: colors.accent,
            color: colors.bgBlack,
          }}
        >
          {status === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="mt-3 text-sm"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            color: colors.accent,
          }}
        >
          {error}
        </p>
      )}
      <p
        className="mt-3 text-xs"
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: tokens.weightBody,
          color: colors.textSecondary,
        }}
      >
        One launch email, plus the occasional build update. Unsubscribe anytime.
      </p>
    </form>
  );
}
