"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  // Small delay before triggering animations so the
  // browser has time to paint the initial layout first
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black">

      {/* ── Background detail ─────────────────────────────────
          A large geometric shape in the background adds depth
          without competing with the text. Purely decorative.
      ──────────────────────────────────────────────────────── */}
      <div
        className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none"
        aria-hidden="true"
      >
        {/* Vertical crimson rule — the recurring motif */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-crimson/20" />
        {/* Large faint square */}
        <div className="absolute top-1/2 -translate-y-1/2 left-12 w-64 h-64 border border-neutral-800" />
        {/* Smaller crimson square, offset */}
        <div className="absolute top-1/2 -translate-y-1/2 left-24 w-32 h-32 border border-crimson/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-32 pb-20">

        {/* ── Eyebrow label ────────────────────────────────── */}
        <div
          className={`
            flex items-center gap-4 mb-8
            animate-fade-up delay-100
          `}
        >
          {/* The short crimson line before labels is the
              recurring visual motif across all sections */}
          <div className="w-8 h-px bg-crimson" />
          <span
            className="text-crimson text-xs tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            Web Studio · Est. 2024
          </span>
        </div>

        {/* ── Main headline ────────────────────────────────── */}
        <h1
          className="animate-fade-up delay-200"
          style={{
            fontFamily:   "var(--font-display)",
            fontSize:     "clamp(48px, 9vw, 120px)",
            fontWeight:   800,
            lineHeight:   0.92,
            letterSpacing: "-0.03em",
            color:        "var(--color-white)",
            maxWidth:     "900px",
          }}
        >
          Bold.<br />
          Digital.<br />
          <span style={{ color: "var(--color-crimson)" }}>Craft.</span>
        </h1>

        {/* ── Sub copy ─────────────────────────────────────── */}
        <p
          className="mt-10 animate-fade-up delay-300"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize:   "clamp(16px, 1.5vw, 19px)",
            color:      "var(--color-neutral-400)",
            maxWidth:   "480px",
            lineHeight: 1.75,
          }}
        >
          Leonis Studios builds high-performance websites, drives
          search growth, and maintains digital infrastructure for
          businesses that refuse to settle.
        </p>

        {/* ── CTAs ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 animate-fade-up delay-400">
          <Link
            href="/contact"
            className="
              inline-flex items-center justify-center gap-3
              px-8 py-4 bg-crimson text-white
              hover:bg-crimson-dark transition-colors duration-200
              group
            "
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "13px",
              fontWeight:    600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span>Start a Project</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>

          <Link
            href="/work"
            className="
              inline-flex items-center justify-center gap-3
              px-8 py-4 border border-neutral-700 text-white
              hover:border-neutral-400 transition-colors duration-200
            "
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "13px",
              fontWeight:    600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            View Our Work
          </Link>
        </div>

        {/* ── Stats ────────────────────────────────────────── */}
        <div className="mt-24 flex flex-wrap gap-12 animate-fade-up delay-500">
          {[
            { value: "01",   label: "Client Served" },
            { value: "100%", label: "Project Success Rate" },
            { value: "4",    label: "Services Offered" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-start gap-4">
              {i > 0 && (
                <div className="w-px h-10 mt-1 bg-neutral-700 self-start" />
              )}
              <div>
                <p
                  style={{
                    fontFamily:    "var(--font-display)",
                    fontSize:      "clamp(28px, 4vw, 48px)",
                    fontWeight:    800,
                    lineHeight:    1,
                    letterSpacing: "-0.02em",
                    color:         "var(--color-white)",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-2 text-neutral-400 text-xs tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Scroll indicator ─────────────────────────────────── */}
      <div className="absolute bottom-8 left-6 lg:left-12 flex items-center gap-3 animate-fade-in delay-500">
        <div className="w-px h-10 bg-linear-to-b from-transparent to-crimson" />
        <span
          className="text-neutral-400 text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
        >
          Scroll
        </span>
      </div>

    </section>
  );
}