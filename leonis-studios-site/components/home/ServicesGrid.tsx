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

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-px"
      style={{ background: colors.bgMuted }}
    >
      {services.map((service, i) => {
        const hovered = hoveredId === service._id;
        return (
          <div
            key={service._id}
            className="p-10 flex flex-col"
            style={{
              background: hovered ? colors.bgMuted : colors.bgCard,
              transition: "background 0.3s",
              cursor:     "default",
              borderTop:  service.featured ? `2px solid ${colors.accent}` : undefined,
            }}
            onMouseEnter={() => setHoveredId(service._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
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
                    color:         colors.textSubtle,
                  }}
                >
                  Most Popular
                </span>
              </div>
            )}

            {/* Service number */}
            <p
              className="mb-6"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "48px",
                fontWeight:    tokens.weightDisplay,
                lineHeight:    1,
                letterSpacing: "-0.03em",
                color:         hovered ? colors.accent : colors.borderLight,
                transition:    "color 0.3s",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </p>

            {/* Service name */}
            <h3
              className="mb-3"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(18px, 2vw, 24px)",
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
        );
      })}
    </div>
  );
}
