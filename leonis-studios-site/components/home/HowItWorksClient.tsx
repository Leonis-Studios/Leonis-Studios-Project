"use client";
// "use client" is required here because this component uses:
//   - useRef + IntersectionObserver (to trigger the step-in animation on scroll)
//   - useState (hover state per step card)
// All copy comes in as props from the Server Component parent (HowItWorks.tsx),
// which fetches it from Sanity — see homePage.howItWorks in the schema.

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";
import { useSandReveal } from "@/lib/hooks/useSandReveal";
import type { HomePageData } from "@/lib/types";

const DEFAULT_STEPS = [
  {
    title: "Discovery",
    description:
      "We talk through your business, your best customers, and what a good lead looks like for you. That conversation shapes the keywords, pages, and calls to action we plan around.",
  },
  {
    title: "Strategy & Design",
    description:
      "We map out the pages people actually search for, then design each one around a single job: getting the visitor to call, book, or send an inquiry. You review and sign off before we build.",
  },
  {
    title: "Build & Optimise",
    description:
      "We build on Next.js with on-page SEO, schema markup for AI search, fast load times, and a CMS you can edit yourself. Every contact form gets tested before launch.",
  },
  {
    title: "Launch & Grow",
    description:
      "We launch, connect Google Search Console and analytics, and show you where your leads come from. Retainer clients get monthly ranking reports and ongoing improvements.",
  },
];

export default function HowItWorksClient({ howItWorks }: { howItWorks?: HomePageData["howItWorks"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const eyebrow        = howItWorks?.eyebrow        || "How It Works";
  const headline        = howItWorks?.headline        || "From first call to a site that brings in leads.";
  const subtext         = howItWorks?.subtext         || "Four clear steps, the same on every project. Search and lead generation are planned in from the start, so you never pay to bolt them on later.";
  const bottomCtaLabel  = howItWorks?.bottomCtaLabel  || "Get a Free Quote";
  const steps           = howItWorks?.steps?.length ? howItWorks.steps : DEFAULT_STEPS;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sand-tornado curtain — swirls across the full step grid once on scroll-in,
  // sharing the same `visible` trigger as the card stagger below so the sweep
  // clears as the steps resolve underneath it.
  const { canvasRef, showCanvas } = useSandReveal({
    trigger:           visible,
    containerRef:      sectionRef,
    color:              "252,163,17",
    mode:               "swirl",
    density:            1100,
    delayRange:         [0, 500],
    durationRange:      [550, 950],
    mobileDensityMult:  0.3,
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Our web design and development process"
      style={{ backgroundColor: colors.bgDark, position: "relative", zIndex: 1, overflow: "hidden" }}
      className="py-28"
    >
      <SandGutter seed={1} />
      <style>{`
        @keyframes processCardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gustLine {
          from { background-position: -60px 0; }
          to   { background-position: 60px 0; }
        }
      `}</style>

      {/* Blowing-sand curtain — one-shot, removed from the DOM after animating */}
      {showCanvas && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ position: "relative", zIndex: 1 }}>
        {/* ── Section header ───────────────────────────────── */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-8 h-px" style={{ background: colors.accent }} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.accent,
              fontSize: "12px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5.5vw, 70px)",
            fontWeight: tokens.weightDisplay,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            color: "var(--color-white)",
            maxWidth: "640px",
          }}
        >
          {headline}
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            fontSize: tokens.fontSizes.body,
            color: colors.textSecondaryLight,
            maxWidth: "480px",
            lineHeight: 1.75,
            marginTop: "16px",
          }}
        >
          {subtext}
        </p>

        {/* ── Steps grid ───────────────────────────────────── */}
        <div
          style={{ backgroundColor: colors.borderDark, gap: "1px", marginTop: "64px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          <ol className="contents">
            {steps.map((step, i) => (
              <li
                key={step.title}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor: colors.surfaceDark,
                  padding: "48px 36px",
                  position: "relative",
                  opacity: visible ? undefined : 0,
                  animation: visible
                    ? `processCardIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms forwards`
                    : undefined,
                  listStyle: "none",
                }}
              >
                {/* Hover accent bar */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "3px",
                    backgroundColor: colors.accent,
                    opacity: hoveredIndex === i ? 1 : 0,
                    transition: "opacity 200ms ease",
                  }}
                />

                {/* Hover gust line — a dashed streak drifts across the top edge */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundImage: `repeating-linear-gradient(90deg, ${colors.accent} 0 10px, transparent 10px 20px)`,
                    backgroundSize: "20px 2px",
                    opacity: hoveredIndex === i ? 0.8 : 0,
                    transition: "opacity 200ms ease",
                    animation: hoveredIndex === i ? "gustLine 1.1s linear infinite" : undefined,
                  }}
                />

                {/* Step number */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "64px",
                    fontWeight: tokens.weightDisplay,
                    color: colors.surfaceAccent,
                    lineHeight: 1,
                    marginBottom: "24px",
                  }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Accent rule */}
                <div
                  style={{
                    width: "32px",
                    height: "2px",
                    backgroundColor: colors.accent,
                    marginBottom: "20px",
                  }}
                />

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: tokens.fontSizes.h3,
                    fontWeight: tokens.weightUI,
                    color: "var(--color-white)",
                    letterSpacing: "-0.01em",
                    marginBottom: "12px",
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: tokens.weightBody,
                    fontSize: "14px",
                    color: colors.textSecondaryLight,
                    lineHeight: 1.75,
                  }}
                >
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <div style={{ marginTop: "48px" }} className="flex justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-neutral-700 text-white hover:border-neutral-400 transition-colors duration-200"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: tokens.weightUI,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {bottomCtaLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
