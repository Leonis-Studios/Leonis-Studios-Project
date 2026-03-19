// Server Component — fetches pricing data from Sanity.
// No interactivity, so no "use client" needed.

import { client } from "@/sanity/lib/client";
import {
  PACKAGE_SERVICES_QUERY,
  ADDON_SERVICES_QUERY,
} from "@/sanity/lib/queries";
import type { Service } from "@/lib/types";
import Link from "next/link";

function formatPrice(
  service: Service | { startingPrice?: number; priceLabel?: string },
): string {
  if ("priceLabel" in service && service.priceLabel) return service.priceLabel;
  if (service.startingPrice)
    return `From $${service.startingPrice.toLocaleString()}`;
  return "Custom quote";
}

export default async function Pricing() {
  const packages: Service[] = await client
    .fetch(PACKAGE_SERVICES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  const addons: Service[] = await client
    .fetch(ADDON_SERVICES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  return (
    <section id="pricing" style={{ background: "#0a0a0a" }} className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Section header ───────────────────────────────── */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-px" style={{ background: "#c41e3a" }} />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "#c41e3a",
              }}
            >
              Investment
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            Simple, transparent pricing
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 300,
              color: "#888",
              maxWidth: "480px",
            }}
          >
            Every project starts with a build. Keep it performing with a monthly
            retainer.
          </p>
        </div>

        {/* ── Package + Retainer rows ───────────────────────── */}
        <div style={{ borderTop: "1px solid #222" }}>
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="py-12"
              style={{ borderBottom: "1px solid #222" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left — Package */}
                <div>
                  {pkg.featured && (
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#c41e3a",
                        marginBottom: "12px",
                      }}
                    >
                      Most Popular
                    </span>
                  )}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(20px, 2.5vw, 28px)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#ffffff",
                      marginBottom: "6px",
                    }}
                  >
                    {pkg.name}
                  </h3>
                  {pkg.tagline && (
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#c41e3a",
                        marginBottom: "12px",
                      }}
                    >
                      {pkg.tagline}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "#888",
                      lineHeight: 1.6,
                      marginBottom: "20px",
                    }}
                  >
                    {pkg.description}
                  </p>

                  {/* Features */}
                  {pkg.features && pkg.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {pkg.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-center gap-3"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            fontWeight: 300,
                            color: "#ccc",
                          }}
                        >
                          <div
                            className="w-1 h-1 shrink-0"
                            style={{ background: "#c41e3a" }}
                          />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Not included */}
                  {pkg.notIncluded && pkg.notIncluded.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {pkg.notIncluded.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            fontWeight: 300,
                            color: "#555",
                          }}
                        >
                          <span style={{ color: "#444" }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Price */}
                  <div className="mt-4">
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "28px",
                        fontWeight: 800,
                        color: "#ffffff",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatPrice(pkg)}
                    </p>
                    {pkg.billingPeriod && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          fontWeight: 300,
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        /{pkg.billingPeriod}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right — Recommended Retainer */}
                {pkg.recommendedRetainer ? (
                  <div
                    style={{
                      background: "#111",
                      padding: "32px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "#1e1e1e",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#555",
                        marginBottom: "12px",
                      }}
                    >
                      Pairs with
                    </p>
                    <h4
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(16px, 2vw, 22px)",
                        fontWeight: 700,
                        letterSpacing: "-0.015em",
                        color: "#ffffff",
                        marginBottom: "16px",
                      }}
                    >
                      {pkg.recommendedRetainer.name}
                    </h4>
                    <div className="mt-auto">
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "24px",
                          fontWeight: 800,
                          color: "#ffffff",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {formatPrice(pkg.recommendedRetainer)}
                      </p>
                      {pkg.recommendedRetainer.billingPeriod && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            fontWeight: 300,
                            color: "#666",
                            marginTop: "2px",
                          }}
                        >
                          /{pkg.recommendedRetainer.billingPeriod}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Add-ons grid ──────────────────────────────────── */}
        {addons && addons.length > 0 && (
          <div className="mt-16">
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                marginBottom: "24px",
              }}
            >
              Add-ons
            </h3>
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
              style={{ background: "#222" }}
            >
              {addons.map((addon) => (
                <div
                  key={addon._id}
                  style={{ background: "#0a0a0a", padding: "24px" }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#ffffff",
                      marginBottom: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {addon.name}
                  </p>
                  {addon.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: "#777",
                        lineHeight: 1.5,
                        marginBottom: "12px",
                      }}
                    >
                      {addon.description}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#c41e3a",
                    }}
                  >
                    {formatPrice(addon)}
                    {addon.billingPeriod && (
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          fontWeight: 300,
                          color: "#666",
                          marginLeft: "4px",
                        }}
                      >
                        /{addon.billingPeriod}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#c41e3a",
              textDecoration: "none",
            }}
          >
            Not sure which fits? Let&apos;s talk →
          </Link>
        </div>
      </div>
    </section>
  );
}
