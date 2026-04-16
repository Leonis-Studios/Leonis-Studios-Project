import Link from "next/link";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";

interface Props {
  ctaHeadline?: string;
  ctaSubtext?: string;
}

export default function AboutCTA({ ctaHeadline, ctaSubtext }: Props) {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: colors.bgDark, borderTop: `1px solid ${colors.surfaceDark}`, position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <SandGutter seed={1} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                fontSize: "clamp(32px, 5vw, 64px)",
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
