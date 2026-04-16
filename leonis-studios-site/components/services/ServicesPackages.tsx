// Server Component — data passed as props from page.tsx.
// ServicesGrid (client) handles hover interactivity.

import type { Service } from "@/lib/types";
import { colors }       from "@/lib/colors";
import { tokens }       from "@/lib/tokens";
import ServicesGrid     from "@/components/home/ServicesGrid";
import SandGutter       from "@/components/SandGutter";

export default function ServicesPackages({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section
      style={{
        position:   "relative",
        zIndex:     1,
        overflow:   "hidden",
        background: colors.bgLight,
      }}
      className="py-24"
    >
      <SandGutter seed={0} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px" style={{ background: "rgba(180,110,0,0.8)" }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                  color:      "rgba(180,110,0,0.9)",
                }}
              >
                Website Packages
              </span>
            </div>
            <h2
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(32px, 5vw, 64px)",
                fontWeight:    tokens.weightDisplay,
                lineHeight:    0.95,
                letterSpacing: "-0.025em",
                color:         colors.bgDark,
              }}
            >
              Choose Your Package
            </h2>
          </div>
          <p
            className="leading-relaxed max-w-xs"
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   tokens.fontSizes.body,
              fontWeight: tokens.weightBody,
              color:      colors.textMuted,
            }}
          >
            Three focused tiers — each executed with the same uncompromising
            standard of craft. No templates, no shortcuts.
          </p>
        </div>

        <ServicesGrid services={services} />

      </div>
    </section>
  );
}
