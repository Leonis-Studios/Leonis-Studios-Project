"use client";
// "use client" is required here because the sunset reveal uses useInViewOnce
// (IntersectionObserver) to trigger the glow + headline/button entrance on
// scroll. Props-only component — matches the precedent set by BenefitsClient.tsx.

import Link from "next/link";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

interface Props {
  ctaHeadline?: string;
  ctaSubtext?: string;
}

export default function AboutCTA({ ctaHeadline, ctaSubtext }: Props) {
  const { ref, inView } = useInViewOnce<HTMLElement>(0.25);

  return (
    <section
      ref={ref}
      className="py-24 lg:py-32"
      style={{ background: colors.bgDark, borderTop: `1px solid ${colors.surfaceDark}`, position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <SandGutter seed={1} />
      <style>{`
        @keyframes ctaFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sunset glow — settles in from the top, dusk bookend to AboutHero's sunrise */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "-25%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "70vh",
          maxWidth: "900px",
          background: "radial-gradient(circle, rgba(252,163,17,0.16) 0%, rgba(252,163,17,0.05) 45%, transparent 70%)",
          opacity: inView ? 1 : 0,
          transition: "opacity 1.4s ease 0.1s",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: "18%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(252,163,17,0.3) 35%, rgba(252,163,17,0.3) 65%, transparent)",
          opacity: inView ? 1 : 0,
          transition: "opacity 1.2s ease 0.3s",
          zIndex: 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ position: "relative", zIndex: 1 }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          style={{ animation: inView ? "ctaFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both" : undefined, opacity: inView ? undefined : 0 }}
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div
                style={{ width: "32px", height: "1px", background: colors.accent }}
              />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                  color: colors.accent,
                }}
              >
                Ready to start?
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5.5vw, 70px)",
                fontWeight: tokens.weightDisplay,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: colors.bgLight,
              }}
            >
              {ctaHeadline ?? (
                <>
                  Ready to work
                  <br />
                  <span style={{ color: colors.accent }}>together?</span>
                </>
              )}
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p
              className="lg:text-right max-w-sm"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: tokens.weightBody,
                color: colors.textSecondary,
                lineHeight: 1.75,
              }}
            >
              {ctaSubtext ??
                "Tell me about your project and We\u2019ll get back to you within 24 hours with a plan and a quote."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 group"
                style={{
                  background: colors.accent,
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  fontWeight: tokens.weightUI,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: colors.bgLight,
                }}
              >
                <span>Start a Project</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-3 px-8 py-4"
                style={{
                  border: `1px solid ${colors.borderDark}`,
                  fontFamily: "var(--font-display)",
                  fontSize: "13px",
                  fontWeight: tokens.weightUI,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: colors.bgLight,
                }}
              >
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
