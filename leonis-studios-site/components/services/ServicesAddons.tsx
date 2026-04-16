"use client";
// Client Component — hover state on cards requires useState/onMouse* handlers.
// Light gray background section (bgMuted) with seed 2 SandGutter.

import { useState, Fragment } from "react";
import Link         from "next/link";
import type { Service } from "@/lib/types";
import { colors }       from "@/lib/colors";
import { tokens }       from "@/lib/tokens";
import SandGutter       from "@/components/SandGutter";

function formatPrice(service: Service): string {
  if (service.priceLabel) return service.priceLabel;
  if (service.startingPrice)
    return `From $${service.startingPrice.toLocaleString()}`;
  return "Custom quote";
}

function AddonCard({ service }: { service: Service }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        "flex",
        flexDirection:  "column",
        height:         "100%",
        borderRadius:   "10px",
        padding:        "2rem",
        background:     hovered ? colors.bgCard : "#f4f4f4",
        border:         hovered
          ? "1px solid rgba(180,110,0,0.5)"
          : "1px solid rgba(180,110,0,0.15)",
        boxShadow:      hovered
          ? "0 8px 32px rgba(180,110,0,0.12), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform:      hovered ? "translateY(-4px)" : "translateY(0)",
        transition:     "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1), border-color 0.2s ease, background 0.2s ease",
      }}
    >
      {/* Accent rule top */}
      <div
        style={{
          height:       "2px",
          borderRadius: "1px",
          marginBottom: "1.5rem",
          background:   hovered
            ? "rgba(180,110,0,0.7)"
            : "rgba(180,110,0,0.25)",
          transition:   "background 0.2s ease",
        }}
      />

      {/* Name */}
      <h3
        style={{
          fontFamily:    "var(--font-display)",
          fontSize:      tokens.fontSizes.h3Compact,
          fontWeight:    tokens.weightHeading,
          letterSpacing: "-0.01em",
          color:         colors.bgDark,
          marginBottom:  "0.75rem",
        }}
      >
        {service.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily:   "var(--font-body)",
          fontSize:     "0.875rem",
          lineHeight:   1.65,
          fontWeight:   tokens.weightBody,
          color:        colors.textMuted,
          flexGrow:     1,
          marginBottom: "1.5rem",
        }}
      >
        {service.description}
      </p>

      {/* Sand-line divider */}
      <div
        style={{
          height:       "1px",
          background:   hovered
            ? "rgba(180,110,0,0.35)"
            : "rgba(180,110,0,0.15)",
          marginBottom: "1rem",
          transition:   "background 0.2s ease",
        }}
      />

      {/* Footer row */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize:   "16px",
            fontWeight: tokens.weightHeading,
            color:      "rgba(180,110,0,0.9)",
          }}
        >
          {formatPrice(service)}
          {service.billingPeriod && (
            <span
              style={{
                fontSize:   "12px",
                fontWeight: tokens.weightSecondary,
                color:      colors.textMuted,
                marginLeft: "4px",
              }}
            >
              /{service.billingPeriod}
            </span>
          )}
        </p>
        <Link
          href="/contact"
          style={{
            fontFamily:     "var(--font-display)",
            fontSize:       "11px",
            fontWeight:     tokens.weightUI,
            letterSpacing:  "0.12em",
            textTransform:  "uppercase",
            color:          hovered ? "rgba(180,110,0,1)" : "rgba(180,110,0,0.7)",
            textDecoration: "none",
            transition:     "color 0.2s ease",
          }}
        >
          Enquire →
        </Link>
      </div>
    </div>
  );
}

export default function ServicesAddons({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section
      style={{
        position:   "relative",
        zIndex:     1,
        overflow:   "hidden",
        background: colors.bgMuted,
      }}
      className="py-24"
    >
      <SandGutter seed={2} />
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
                Add-On Services
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
              Extend Your Project
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
            Bolt on exactly what you need. Each add-on pairs with any
            package or retainer to enhance your digital presence.
          </p>
        </div>

        {/* Add-on cards — single col on mobile, 5-col (card|dot|card|dot|card) on desktop */}
        <div className="grid grid-cols-1 gap-6 lg:gap-0 lg:grid-cols-[1fr_48px_1fr_48px_1fr] lg:items-stretch">
          {services.map((service, i) => (
            <Fragment key={service._id}>
              <AddonCard service={service} />

              {/* Connector — only between cards, hidden on mobile */}
              {i < services.length - 1 && (
                <div
                  className="hidden lg:flex"
                  style={{
                    flexDirection:  "column",
                    alignItems:     "center",
                    justifyContent: "center",
                    gap:            "5px",
                  }}
                >
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "transparent", border: "2px solid rgba(180,110,0,0.9)", flexShrink: 0 }} />
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(180,110,0,0.9)", flexShrink: 0 }} />
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(180,110,0,0.9)", flexShrink: 0 }} />
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(180,110,0,0.9)", flexShrink: 0 }} />
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "transparent", border: "2px solid rgba(180,110,0,0.9)", flexShrink: 0 }} />
                </div>
              )}
            </Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
