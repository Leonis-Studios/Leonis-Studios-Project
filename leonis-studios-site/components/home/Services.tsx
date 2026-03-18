"use client";
// This is a Server Component — it fetches data directly
// from Sanity without any client-side JavaScript.
// No "use client" means it runs on the server, which is
// faster and better for SEO since the content is in the
// HTML before it reaches the browser.

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { ALL_SERVICES_QUERY } from "@/sanity/lib/queries";
import type { Service } from "@/lib/types";

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

        {/* ── Service grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100">
          {services.map((service, i) => (
            <div
              key={service._id}
              className="bg-white p-10 group hover:bg-neutral-100 transition-colors duration-300"
            >
              {/* Service number */}
              <p
                className="text-neutral-200 mb-6 group-hover:text-crimson/40 transition-colors duration-300"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "48px",
                  fontWeight:    800,
                  lineHeight:    1,
                  letterSpacing: "-0.03em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>

              {/* Service name */}
              <h3
                className="text-black mb-3 group-hover:text-crimson transition-colors duration-300"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "clamp(18px, 2vw, 24px)",
                  fontWeight:    700,
                  letterSpacing: "-0.015em",
                }}
              >
                {service.name}
              </h3>

              {/* Tagline */}
              {service.tagline && (
                <p
                  className="text-crimson text-xs tracking-[0.15em] uppercase mb-4"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {service.tagline}
                </p>
              )}

              {/* Description */}
              <p
                className="text-neutral-600 text-sm leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                {service.description}
              </p>

              {/* Features list */}
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {service.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-sm text-neutral-600"
                      style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                    >
                      <div className="w-1 h-1 bg-crimson shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price */}
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-200 group-hover:border-neutral-300 transition-colors duration-300">
                <p
                  className="text-black"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize:   "20px",
                    fontWeight: 700,
                  }}
                >
                  {service.price
                    ? `From $${service.price.toLocaleString()}`
                    : "Custom quote"}
                </p>
                <Link
                  href="/contact"
                  className="text-crimson text-xs tracking-[0.12em] uppercase hover:text-black transition-colors duration-200 flex items-center gap-2 group/link"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
                >
                  <span>Enquire</span>
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}