"use client";

import { useState }  from "react";
import Link          from "next/link";
import type { Service } from "@/lib/types";

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
              background:  hovered ? "#e8e8e8" : "#ffffff",
              transition:  "background 0.3s",
              cursor:      "default",
            }}
            onMouseEnter={() => setHoveredId(service._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
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
              <ul className="space-y-2 mb-8">
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
                    <div
                      className="w-1 h-1 shrink-0"
                      style={{ background: "#c41e3a" }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>
            )}

            {/* Price + Enquire */}
            <div
              className="flex items-center justify-between mt-auto pt-6"
              style={{
                borderTop:  "1px solid #e8e8e8",
                transition: "border-color 0.3s",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "20px",
                  fontWeight: 700,
                  color:      "#0a0a0a",
                }}
              >
                {service.price
                  ? `From $${service.price.toLocaleString()}`
                  : "Custom quote"}
              </p>
              <Link
                href="/contact"
                className="flex items-center gap-2"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "12px",
                  fontWeight:    600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "#c41e3a",
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
