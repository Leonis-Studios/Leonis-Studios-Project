"use client";

import { useState }     from "react";
import Link             from "next/link";
import type { Service } from "@/lib/types";

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
      style={{ background: "#e8e8e8" }}
    >
      {services.map((service, i) => {
        const hovered = hoveredId === service._id;
        return (
          <div
            key={service._id}
            className="p-10 flex flex-col"
            style={{
              background: hovered ? "#e8e8e8" : "#ffffff",
              transition: "background 0.3s",
              cursor:     "default",
              borderTop:  service.featured ? "2px solid #c41e3a" : undefined,
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
                    fontWeight:    700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color:         "#c41e3a",
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
                fontWeight:    800,
                lineHeight:    1,
                letterSpacing: "-0.03em",
                color:         hovered ? "#c41e3a" : "#cccccc",
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
                fontWeight:    700,
                letterSpacing: "-0.015em",
                color:         hovered ? "#c41e3a" : "#0a0a0a",
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
                  fontWeight: 500,
                  color:      "#c41e3a",
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
                fontWeight: 300,
                color:      "#3d3d3d",
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
                      fontWeight: 300,
                      color:      "#3d3d3d",
                    }}
                  >
                    <div className="w-1 h-1 shrink-0" style={{ background: "#c41e3a" }} />
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
                      fontWeight: 300,
                      color:      "#999",
                    }}
                  >
                    <span style={{ color: "#bbb" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Price + Enquire */}
            <div
              className="flex items-start justify-between mt-auto pt-6"
              style={{ borderTop: "1px solid #e8e8e8" }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize:   "20px",
                    fontWeight: 700,
                    color:      "#0a0a0a",
                  }}
                >
                  {formatPrice(service)}
                </p>
                {service.billingPeriod && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize:   "12px",
                      fontWeight: 300,
                      color:      "#888",
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
                      fontWeight: 400,
                      color:      "#888",
                      marginTop:  "6px",
                    }}
                  >
                    Pairs with{" "}
                    <span style={{ color: "#555" }}>{service.recommendedRetainer.name}</span>
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
                  fontWeight:     600,
                  letterSpacing:  "0.12em",
                  textTransform:  "uppercase",
                  color:          "#c41e3a",
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
