// Server Component — mirrors the home CTA structure.
// Black background with seed 3 SandGutter.

import Link        from "next/link";
import { colors }  from "@/lib/colors";
import { tokens }  from "@/lib/tokens";
import SandGutter  from "@/components/SandGutter";

export default function ServicesCTA() {
  return (
    <section
      className="py-24 border-t border-neutral-800"
      style={{
        position:   "relative",
        zIndex:     1,
        overflow:   "hidden",
        background: colors.bgBlack,
      }}
    >
      <SandGutter seed={3} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px" style={{ background: colors.accent }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  color:      colors.accent,
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                }}
              >
                Ready to Start?
              </span>
            </div>
            <h2
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(32px, 5vw, 64px)",
                fontWeight:    tokens.weightDisplay,
                lineHeight:    0.95,
                letterSpacing: "-0.025em",
                color:         colors.textPrimary,
              }}
            >
              Let's build something worth talking about.
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p
              className="text-sm leading-relaxed lg:text-right max-w-sm"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: tokens.weightBody,
                color:      colors.textSecondaryLight,
              }}
            >
              Tell us about your project and we'll respond within 24 hours
              with a plan and a quote — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 text-white group transition-colors duration-200"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    tokens.weightUI,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background:    colors.accent,
                }}
              >
                <span>Get In Touch</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-neutral-700 text-white hover:border-neutral-400 transition-colors duration-200"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    tokens.weightUI,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
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
