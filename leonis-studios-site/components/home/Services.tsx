// Server Component — fetches website packages from Sanity.
// Hover interactivity is handled by the child ServicesGrid client component.

import { client }                from "@/sanity/lib/client";
import { PACKAGE_SERVICES_QUERY } from "@/sanity/lib/queries";
import type { Service }          from "@/lib/types";
import ServicesGrid              from "@/components/home/ServicesGrid";
import Link                      from "next/link";
import { colors }                from "@/lib/colors";
import { tokens }                from "@/lib/tokens";

export default async function Services() {
  const services: Service[] = await client
    .fetch(PACKAGE_SERVICES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  return (
    <section id="services" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ───────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px" style={{ background: colors.accent }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI, color: colors.accent }}
              >
                What We Do
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
              Our Services
            </h2>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textMuted }}
          >
            Three focused website packages, each executed with the same
            uncompromising standard of craft.
          </p>
        </div>

        {/* ── Service grid (client component handles hover) ─── */}
        <ServicesGrid services={services} />

        {/* ── Bottom link ──────────────────────────────────── */}
        <div className="mt-12 flex justify-center">
          <Link
            href="#pricing"
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "13px",
              fontWeight:    tokens.weightUI,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         colors.accent,
              textDecoration: "none",
            }}
          >
            View all services &amp; pricing →
          </Link>
        </div>

      </div>
    </section>
  );
}
