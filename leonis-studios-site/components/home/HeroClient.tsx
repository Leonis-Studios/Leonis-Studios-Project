"use client";
// "use client" is required here because this component uses:
//   - useState (to track scroll position for the scroll indicator)
//   - useEffect (to add/remove the scroll event listener)
// All copy comes in as props from the Server Component parent (Hero.tsx),
// which fetches it from Sanity — see homePage.hero in the schema.

import Link from "next/link";
import { useState, useEffect } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import type { HomePageData } from "@/lib/types";

const DEFAULT_STATS = [
  { value: "100%", label: "Project Success Rate" },
  { value: "4", label: "Services Offered" },
  { value: "48hr", label: "Average Response Time" },
];

export default function HeroClient({ hero }: { hero?: HomePageData["hero"] }) {
  const [pastHero, setPastHero] = useState(false);

  const eyebrow           = hero?.eyebrow           || "Web Design & Search Growth Studio";
  const headlineLine1     = hero?.headlineLine1     || "Bold.";
  const headlineLine2     = hero?.headlineLine2     || "Digital.";
  const headlineAccent    = hero?.headlineAccent    || "Craft.";
  const subcopy           = hero?.subcopy           || "Leonis Studios builds fast, custom websites and makes sure people actually find them, through Google, AI answer engines, and everywhere search is heading next.";
  const primaryCtaLabel   = hero?.primaryCtaLabel   || "Start a Project";
  const secondaryCtaLabel = hero?.secondaryCtaLabel || "View Our Work";
  const stats             = hero?.stats?.length ? hero.stats : DEFAULT_STATS;

  useEffect(() => {
    const onScroll = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative flex flex-col overflow-hidden bg-black" style={{ minHeight: "calc(100svh - 48px)" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Background detail ──────────────────────────────── */}
      <div
        className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none"
        style={{ opacity: 0.4 }}
        aria-hidden="true"
      >
        <div className="absolute left-0 top-0 bottom-0 w-px opacity-20" style={{ backgroundColor: colors.accent }} />
        <div className="absolute top-1/2 -translate-y-1/2 left-12 w-64 h-64 border border-neutral-800" />
        <div className="absolute top-1/2 -translate-y-1/2 left-24 w-32 h-32 border opacity-20" style={{ borderColor: colors.accent }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center flex-1 pt-28 pb-6">
        {/* ── Eyebrow label ──────────────────────────────────── */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards",
          }}
        >
          <div className="w-8 h-px" style={{ backgroundColor: colors.accent }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: colors.accent, fontFamily: "var(--font-display)", fontWeight: tokens.weightUI }}
          >
            {eyebrow}
          </span>
        </div>

        {/* ── Main headline ──────────────────────────────────── */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(52px, 9.5vw, 128px)",
            fontWeight: tokens.weightDisplay,
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            color: "var(--color-white)",
            maxWidth: "900px",
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards",
          }}
        >
          {headlineLine1}
          <br />
          {headlineLine2}
          <br />
          <span style={{ color: colors.accent }}>{headlineAccent}</span>
        </h1>

        {/* ── Sub copy ───────────────────────────────────────── */}
        <p
          className="mt-10"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            fontSize: tokens.fontSizes.bodyLarge,
            color: "var(--color-neutral-400)",
            maxWidth: "480px",
            lineHeight: 1.75,
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
          }}
        >
          {subcopy}
        </p>

        {/* ── CTAs ───────────────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-12"
          style={{
            opacity: 0,
            animation:
              "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards",
          }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-white transition-colors duration-200 group"
            style={{
              backgroundColor: colors.accent,
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: tokens.weightUI,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span>{primaryCtaLabel}</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>

          <Link
            href="/work"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-neutral-700 text-white hover:border-neutral-400 transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: tokens.weightUI,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {secondaryCtaLabel}
          </Link>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-12 w-full pb-8"
        style={{
          opacity: 0,
          animation: "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards",
        }}
      >
        <div className="flex flex-wrap gap-12 pt-8 border-t border-neutral-800">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-start gap-4">
              {i > 0 && (
                <div className="w-px h-10 mt-1 bg-neutral-700 self-start" />
              )}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(30px, 4.2vw, 52px)",
                    fontWeight: tokens.weightDisplay,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: "var(--color-white)",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-2 text-xs tracking-[0.15em] uppercase"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightUI,
                    color: "var(--color-neutral-400)",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────
          Only renders after 1.5s (indicatorVisible) so it
          doesn't conflict with the page load animations.
          Hides smoothly when user scrolls past the hero.
      ──────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: "32px",
          left: "48px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          opacity: pastHero ? 0 : 1,
          transition: "opacity 0.4s ease",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "40px",
            background: `linear-gradient(to bottom, transparent, ${colors.accent})`,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "10px",
            fontWeight: tokens.weightUI,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: colors.textNav,
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
