"use client";

import { useState }     from "react";
import Link             from "next/link";
import type { Service } from "@/lib/types";
import { colors }       from "@/lib/colors";
import { tokens }       from "@/lib/tokens";

function formatPrice(service: Service): string {
  if (service.priceLabel) return service.priceLabel;
  if (service.startingPrice) return `From $${service.startingPrice.toLocaleString()}`;
  return "Custom quote";
}

// Alignment for the cascading desert plateau layout (desktop only)
const CASCADE_ALIGN = [
  { marginLeft: "0",    marginRight: "auto" }, // card 1 — left
  { marginLeft: "auto", marginRight: "auto" }, // card 2 — center
  { marginLeft: "auto", marginRight: "0"    }, // card 3 — right
] as const;

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-0">
      {services.map((service, i) => {
        const hovered = hoveredId === service._id;
        const align   = CASCADE_ALIGN[i] ?? CASCADE_ALIGN[0];
        const isLast  = i === services.length - 1;

        return (
          <div key={service._id}>
            {/* ── Card ─────────────────────────────────────────── */}
            <div
              className="relative w-full md:max-w-2xl p-10 flex flex-col overflow-hidden"
              style={{
                marginLeft:  align.marginLeft,
                marginRight: align.marginRight,
                // Vertical stagger — each card slightly overlaps the previous on desktop
                marginTop: i === 0 ? 0 : undefined,
                background:  hovered ? colors.bgMuted : colors.bgCard,
                boxShadow:   hovered
                  ? "0 8px 40px rgba(252,163,17,0.18), 0 0 0 1px rgba(252,163,17,0.30)"
                  : "0 0 0 1px rgba(252,163,17,0.12)",
                transform:   hovered ? "translateY(-4px)" : "translateY(0)",
                transition:  "transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease",
                cursor:      "default",
                // Featured card gets a stronger top accent
                borderTop: service.featured
                  ? `2px solid ${colors.accent}`
                  : "2px solid rgba(252,163,17,0.30)",
              }}
              onMouseEnter={() => setHoveredId(service._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Ghost numeral — carved stone aesthetic */}
              <span
                aria-hidden="true"
                style={{
                  position:    "absolute",
                  bottom:      "-16px",
                  right:       "24px",
                  fontFamily:  "var(--font-display)",
                  fontSize:    "180px",
                  fontWeight:  tokens.weightDisplay,
                  lineHeight:  1,
                  color:       colors.bgDark,
                  opacity:     hovered ? 0.07 : 0.04,
                  transition:  "opacity 0.35s ease",
                  userSelect:  "none",
                  pointerEvents: "none",
                  letterSpacing: "-0.05em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Featured label */}
              {service.featured && (
                <div className="mb-4">
                  <span
                    style={{
                      fontFamily:    "var(--font-display)",
                      fontSize:      "10px",
                      fontWeight:    tokens.weightUI,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color:         colors.accent,
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Service number — small, above name */}
              <p
                className="mb-3"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    tokens.weightUI,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         hovered ? colors.accent : colors.textSubtle,
                  transition:    "color 0.3s",
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </p>

              {/* Service name */}
              <h3
                className="mb-3"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      tokens.fontSizes.h3,
                  fontWeight:    tokens.weightHeading,
                  letterSpacing: "-0.015em",
                  color:         hovered ? colors.accent : colors.bgDark,
                  transition:    "color 0.3s",
                }}
              >
                {service.name}
              </h3>

              {/* Tagline */}
              {service.tagline && (
                <p
                  className="text-xs tracking-[0.15em] uppercase mb-4"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightUI,
                    color:      colors.textSubtle,
                  }}
                >
                  {service.tagline}
                </p>
              )}

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-8"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: tokens.weightBody,
                  color:      colors.textSubtle,
                }}
              >
                {service.description}
              </p>

              {/* Features list */}
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {service.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-sm"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: tokens.weightBody,
                        color:      colors.textSubtle,
                      }}
                    >
                      <div className="w-1 h-1 shrink-0" style={{ background: colors.accent }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              )}

              {/* Not included */}
              {service.notIncluded && service.notIncluded.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {service.notIncluded.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: tokens.weightSecondary,
                        color:      colors.textMuted,
                      }}
                    >
                      <span style={{ color: colors.textSecondary }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Price + Enquire */}
              <div
                className="flex items-start justify-between mt-auto pt-6"
                style={{ borderTop: `1px solid ${colors.bgMuted}` }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize:   "20px",
                      fontWeight: tokens.weightHeading,
                      color:      colors.bgDark,
                    }}
                  >
                    {formatPrice(service)}
                  </p>
                  {service.billingPeriod && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize:   "12px",
                        fontWeight: tokens.weightSecondary,
                        color:      colors.textSecondary,
                        marginTop:  "2px",
                      }}
                    >
                      /{service.billingPeriod}
                    </p>
                  )}
                  {/* Retainer pairing callout */}
                  {service.recommendedRetainer && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize:   "11px",
                        fontWeight: tokens.weightBody,
                        color:      colors.textSecondary,
                        marginTop:  "6px",
                      }}
                    >
                      Pairs with{" "}
                      <span style={{ color: colors.textMuted }}>{service.recommendedRetainer.name}</span>
                      {service.recommendedRetainer.startingPrice
                        ? ` from $${service.recommendedRetainer.startingPrice.toLocaleString()}/mo`
                        : ""}
                    </p>
                  )}
                </div>
                <Link
                  href="/contact"
                  className="flex items-center gap-2"
                  style={{
                    fontFamily:     "var(--font-display)",
                    fontSize:       "12px",
                    fontWeight:     tokens.weightUI,
                    letterSpacing:  "0.12em",
                    textTransform:  "uppercase",
                    color:          colors.accent,
                    textDecoration: "none",
                  }}
                >
                  <span>Enquire</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* ── Gold divider between cards (not after last) ── */}
            {!isLast && (
              <div
                className="relative flex items-center justify-center my-6"
                aria-hidden="true"
              >
                <div
                  style={{
                    position:   "absolute",
                    left:       0,
                    right:      0,
                    height:     "1px",
                    background: "linear-gradient(90deg, transparent 0%, rgba(252,163,17,0.5) 30%, rgba(252,163,17,0.5) 70%, transparent 100%)",
                  }}
                />
                <span
                  style={{
                    position:        "relative",
                    fontFamily:      "var(--font-display)",
                    fontSize:        "10px",
                    color:           colors.accent,
                    background:      colors.bgLight,
                    padding:         "0 12px",
                    letterSpacing:   "0.1em",
                    opacity:         0.8,
                  }}
                >
                  ◆
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
