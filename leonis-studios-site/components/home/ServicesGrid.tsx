"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

function formatPrice(service: Service): string {
  if (service.priceLabel) return service.priceLabel;
  if (service.startingPrice)
    return `From $${service.startingPrice.toLocaleString()}`;
  return "Custom quote";
}

export default function ServicesGrid({ services }: { services: Service[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* SVG filters + gradient masks — defined once, referenced by all card overlays */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          {/* Original grain filter — kept for compatibility */}
          <filter id="card-grain" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.80 0.70" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended" />
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>

          {/* Crack-texture filter — turbulence → threshold → sharpen → warp → colorize */}
          <filter id="crack-texture" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.045 0.065" numOctaves="5" seed="3" stitchTiles="stitch" result="crackNoise" />
            <feColorMatrix type="saturate" values="0" in="crackNoise" result="grayNoise" />
            <feComponentTransfer in="grayNoise" result="crackMask">
              <feFuncR type="discrete" tableValues="0 0 0 0 1" />
              <feFuncG type="discrete" tableValues="0 0 0 0 1" />
              <feFuncB type="discrete" tableValues="0 0 0 0 1" />
              <feFuncA type="discrete" tableValues="0 0 0 0 1" />
            </feComponentTransfer>
            <feConvolveMatrix in="crackMask" order="3" kernelMatrix="-1 -1 -1 -1 9 -1 -1 -1 -1" divisor="1" bias="0" result="crackSharp" />
            <feTurbulence type="turbulence" baseFrequency="0.018 0.022" numOctaves="2" seed="7" result="warpNoise" />
            <feDisplacementMap in="crackSharp" in2="warpNoise" scale="10" xChannelSelector="R" yChannelSelector="G" result="cracksWarped" />
            <feFlood floodColor="rgba(180,110,0,1)" result="goldColor" />
            <feComposite in="goldColor" in2="cracksWarped" operator="in" result="goldCracks" />
            <feComposite in="goldCracks" in2="SourceGraphic" operator="in" />
          </filter>

          {/* Radial gradient masks — one per corner, fade cracks toward card center */}
          <radialGradient id="mask-tl" cx="0" cy="0" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="35%"  stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mask-tr" cx="400" cy="0" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="35%"  stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mask-bl" cx="0" cy="500" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="35%"  stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mask-br" cx="400" cy="500" r="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="white" stopOpacity="1" />
            <stop offset="35%"  stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          <mask id="fade-tl"><rect x="0" y="0" width="400" height="500" fill="url(#mask-tl)" /></mask>
          <mask id="fade-tr"><rect x="0" y="0" width="400" height="500" fill="url(#mask-tr)" /></mask>
          <mask id="fade-bl"><rect x="0" y="0" width="400" height="500" fill="url(#mask-bl)" /></mask>
          <mask id="fade-br"><rect x="0" y="0" width="400" height="500" fill="url(#mask-br)" /></mask>
        </defs>
      </svg>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service, i) => {
          const hovered = hoveredId === service._id;

          return (
            <div
              key={service._id}
              className="relative w-full p-10 flex flex-col overflow-hidden"
              style={{
                background: hovered ? colors.bgMuted : colors.bgCard,
                boxShadow: hovered
                  ? "0 8px 40px rgba(252,163,17,0.18), 0 0 0 1px rgba(252,163,17,0.30)"
                  : "0 0 0 1px rgba(252,163,17,0.12)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                transition:
                  "transform 0.35s ease, box-shadow 0.35s ease, background 0.35s ease",
                cursor: "default",
                borderTop: service.featured
                  ? `2px solid ${colors.accent}`
                  : "2px solid rgba(252,163,17,0.30)",
              }}
              onMouseEnter={() => setHoveredId(service._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Layer A — Sandy warmth concentrated at corners */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 0,
                  background: `
                    radial-gradient(ellipse 55% 42% at top left,    rgba(180,110,0,0.20) 0%, transparent 44%),
                    radial-gradient(ellipse 55% 42% at top right,   rgba(180,110,0,0.15) 0%, transparent 42%),
                    radial-gradient(ellipse 55% 42% at bottom left,  rgba(180,110,0,0.14) 0%, transparent 40%),
                    radial-gradient(ellipse 55% 42% at bottom right, rgba(180,110,0,0.12) 0%, transparent 38%)
                  `,
                  opacity: hovered ? 0.75 : 1,
                  transition: "opacity 0.35s ease",
                }}
              />

              {/* Layer B — Turbulence crack veins radiating from corners, masked to fade */}
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                  opacity: hovered ? 0.20 : 0.38,
                  transition: "opacity 0.35s ease",
                }}
                preserveAspectRatio="none"
                viewBox="0 0 400 500"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g mask="url(#fade-tl)">
                  <rect x="0" y="0" width="400" height="500" fill="rgba(180,110,0,1)" filter="url(#crack-texture)" />
                </g>
                <g mask="url(#fade-tr)">
                  <rect x="0" y="0" width="400" height="500" fill="rgba(180,110,0,1)" filter="url(#crack-texture)" />
                </g>
                <g mask="url(#fade-bl)">
                  <rect x="0" y="0" width="400" height="500" fill="rgba(180,110,0,1)" filter="url(#crack-texture)" />
                </g>
                <g mask="url(#fade-br)">
                  <rect x="0" y="0" width="400" height="500" fill="rgba(180,110,0,1)" filter="url(#crack-texture)" />
                </g>
              </svg>

              {/* Ghost numeral — carved stone aesthetic */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-16px",
                  right: "24px",
                  fontFamily: "var(--font-display)",
                  fontSize: "180px",
                  fontWeight: tokens.weightDisplay,
                  lineHeight: 1,
                  color: colors.bgDark,
                  opacity: hovered ? 0.07 : 0.04,
                  transition: "opacity 0.35s ease",
                  userSelect: "none",
                  pointerEvents: "none",
                  letterSpacing: "-0.05em",
                  zIndex: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Card content — sits above the grain overlay via natural stacking */}
              <div className="relative flex flex-col flex-1" style={{ zIndex: 1 }}>

                {/* Featured label */}
                {service.featured && (
                  <div className="mb-4">
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "10px",
                        fontWeight: tokens.weightUI,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: colors.accent,
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
                    fontFamily: "var(--font-display)",
                    fontSize: "13px",
                    fontWeight: tokens.weightUI,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: hovered ? colors.accent : colors.textSubtle,
                    transition: "color 0.3s",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(services.length).padStart(2, "0")}
                </p>

                {/* Service name */}
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: tokens.fontSizes.h3,
                    fontWeight: tokens.weightHeading,
                    letterSpacing: "-0.015em",
                    color: hovered ? colors.accent : colors.bgDark,
                    transition: "color 0.3s",
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
                      color: colors.textSubtle,
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
                    color: colors.textSubtle,
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
                          color: colors.textSubtle,
                        }}
                      >
                        <div
                          className="w-1 h-1 shrink-0"
                          style={{ background: colors.accent }}
                        />
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
                          color: colors.textMuted,
                        }}
                      >
                        <span style={{ color: colors.textMuted }}>—</span>
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
                        fontSize: "20px",
                        fontWeight: tokens.weightHeading,
                        color: colors.bgDark,
                      }}
                    >
                      {formatPrice(service)}
                    </p>
                    {service.billingPeriod && (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          fontWeight: tokens.weightSecondary,
                          color: colors.textMuted,
                          marginTop: "2px",
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
                          fontSize: "11px",
                          fontWeight: tokens.weightBody,
                          color: colors.textMuted,
                          marginTop: "6px",
                        }}
                      >
                        Pairs with{" "}
                        <span style={{ color: colors.textMuted }}>
                          {service.recommendedRetainer.name}
                        </span>
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
                      fontFamily: "var(--font-display)",
                      fontSize: "12px",
                      fontWeight: tokens.weightUI,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: colors.accent,
                      textDecoration: "none",
                    }}
                  >
                    <span>Enquire</span>
                    <span>→</span>
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
