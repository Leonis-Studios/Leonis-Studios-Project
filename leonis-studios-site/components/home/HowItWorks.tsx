"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We learn your business, audience, and goals in a focused kickoff call. No briefs, no bloated onboarding — just a direct conversation.",
  },
  {
    number: "02",
    title: "Strategy & Design",
    description:
      "We plan your site architecture and design every page before writing a line of code. You review and approve at every stage.",
  },
  {
    number: "03",
    title: "Build & Optimise",
    description:
      "Your site is built on Next.js for speed and scale, with Core Web Vitals optimisation, structured data, on-page SEO, and CMS integration from day one.",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description:
      "We handle deployment, verification, and handoff. Retainer clients get ongoing SEO reports, content updates, and performance monitoring.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  return (
    <section
      ref={sectionRef}
      aria-label="Our web design and development process"
      style={{ backgroundColor: colors.bgDark }}
      className="py-28"
    >
      <style>{`
        @keyframes processCardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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
            How It Works
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: tokens.weightDisplay,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            color: "var(--color-white)",
            maxWidth: "640px",
          }}
        >
          A clear path from idea to launch.
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
          No guesswork. No disappearing acts. Every project follows the same
          four-phase process — so you&apos;re never in the dark.
        </p>

        {/* ── Steps grid ───────────────────────────────────── */}
        <div
          style={{ backgroundColor: colors.borderDark, gap: "1px", marginTop: "64px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          <ol className="contents">
            {steps.map((step, i) => (
              <li
                key={step.number}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor: colors.surfaceDark,
                  padding: "40px 32px",
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
                  {step.number}
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
            Start Your Project →
          </Link>
        </div>
      </div>
    </section>
  );
}
