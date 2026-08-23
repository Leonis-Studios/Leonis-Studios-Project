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
      "We learn your business, audience, and goals in a focused kickoff call. No briefs, no bloated onboarding, just a direct conversation.",
  },
  {
    title: "Strategy & Design",
    description:
      "We plan your site architecture and design every page before writing a line of code. You review and approve at every stage.",
  },
  {
    title: "Build & Optimise",
    description:
      "Your site is built on Next.js for speed and scale, with Core Web Vitals optimisation, structured data, on-page SEO, and CMS integration from day one.",
  },
  {
    title: "Launch & Grow",
    description:
      "We handle deployment, verification, and handoff. Retainer clients get ongoing SEO reports, content updates, and performance monitoring.",
  },
];

export default function HowItWorksClient({ howItWorks }: { howItWorks?: HomePageData["howItWorks"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const eyebrow        = howItWorks?.eyebrow        || "How It Works";
  const headline        = howItWorks?.headline        || "A clear path from idea to launch.";
  const subtext         = howItWorks?.subtext         || "No guesswork, no disappearing acts. Every project follows the same four-phase process, with SEO and site structure built in from day one, so you always know where things stand.";
  const bottomCtaLabel  = howItWorks?.bottomCtaLabel  || "Start Your Project";
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
