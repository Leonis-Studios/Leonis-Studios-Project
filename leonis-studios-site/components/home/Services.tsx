// Server Component — fetches data directly from Sanity.
// Hover interactivity is handled by the child ServicesGrid client component.

import { client }            from "@/sanity/lib/client";
import { ALL_SERVICES_QUERY } from "@/sanity/lib/queries";
import type { Service }       from "@/lib/types";
import ServicesGrid           from "@/components/home/ServicesGrid";

export default async function Services() {
  // This is how you fetch from Sanity in a Server Component.
  // client.fetch runs the GROQ query and returns typed data.
  // The { next: { revalidate: 3600 } } tells Next.js to
  // cache this response and refresh it every hour (3600s).
  // So content updates in Sanity go live within an hour
  // without needing a full redeploy.
  const services: Service[] = await client.fetch(
    ALL_SERVICES_QUERY,
    {},
    { next: { revalidate: 3600 } }
  );

  return (
    <section id="services" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ───────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-crimson" />
              <span
                className="text-crimson text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
              >
                What We Do
              </span>
            </div>
            <h2
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(32px, 5vw, 64px)",
                fontWeight:    800,
                lineHeight:    0.95,
                letterSpacing: "-0.025em",
                color:         "var(--color-black)",
              }}
            >
              Our Services
            </h2>
          </div>
          <p
            className="text-neutral-600 text-sm leading-relaxed max-w-xs"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Four focused offerings, each executed with the same
            uncompromising standard of craft.
          </p>
        </div>

        {/* ── Service grid (client component handles hover) ─── */}
        <ServicesGrid services={services} />

      </div>
    </section>
  );
}