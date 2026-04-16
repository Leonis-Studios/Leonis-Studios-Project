// Server Component — no interactivity needed.
// Dark background section (surfaceDark) with seed 1 SandGutter.

import Link        from "next/link";
import type { Service } from "@/lib/types";
import { colors }       from "@/lib/colors";
import { tokens }       from "@/lib/tokens";
import SandGutter       from "@/components/SandGutter";

const GLYPHS = ["◌", "◉", "◈"] as const;

function formatPrice(service: Service): string {
  if (service.priceLabel) return service.priceLabel;
  if (service.startingPrice)
    return `From $${service.startingPrice.toLocaleString()}`;
  return "Custom quote";
}

export default function ServicesRetainers({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <>
      <style>{`
        .sand-texture {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(252, 163, 17, 0.03) 3px,
            rgba(252, 163, 17, 0.03) 4px
          );
        }
      `}</style>

      <section
        style={{
          position:   "relative",
          zIndex:     1,
          overflow:   "hidden",
          background: colors.surfaceDark,
        }}
        className="py-24"
      >
        <SandGutter seed={1} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px" style={{ background: colors.accent }} />
                <span
                  className="text-xs tracking-[0.25em] uppercase"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightUI,
                    color:      colors.accent,
                  }}
                >
                  Ongoing Growth
                </span>
              </div>
              <h2
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "clamp(32px, 5vw, 64px)",
                  fontWeight:    tokens.weightDisplay,
                  lineHeight:    0.95,
                  letterSpacing: "-0.025em",
                  color:         colors.textPrimary,
                }}
              >
                Monthly Retainers
              </h2>
            </div>
            <p
              className="leading-relaxed max-w-xs"
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   tokens.fontSizes.body,
                fontWeight: tokens.weightBody,
                color:      colors.textSecondaryLight,
              }}
            >
              Your site launches on day one. A retainer keeps it growing,
              secure, and ahead of the competition every month after.
            </p>
          </div>

          {/* Retainer cards — 3-col on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ alignItems: "stretch" }}>
            {services.map((service, i) => (
              <div
                key={service._id}
                style={{
                  display:        "flex",
                  flexDirection:  "column",
                  padding:        "2.5rem",
                  position:       "relative",
                  overflow:       "hidden",
                  background: service.featured
                    ? "rgba(252, 163, 17, 0.04)"
                    : colors.surfaceDark,
                  border: service.featured
                    ? "1px solid rgba(252, 163, 17, 0.5)"
                    : "1px solid rgba(41, 68, 126, 0.5)",
                }}
              >
                  {/* Tier glyph */}
                  <div
                    aria-hidden="true"
                    style={{
                      fontSize:     "22px",
                      lineHeight:   1,
                      color:        colors.accent,
                      marginBottom: "12px",
                    }}
                  >
                    {GLYPHS[i] ?? "◌"}
                  </div>

                  {/* Featured badge */}
                  {service.featured && (
                    <div style={{ marginBottom: "1rem" }}>
                      <span
                        style={{
                          fontFamily:    "var(--font-display)",
                          fontSize:      "10px",
                          fontWeight:    tokens.weightUI,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color:         colors.accent,
                          background:    "rgba(252, 163, 17, 0.1)",
                          border:        "1px solid rgba(252, 163, 17, 0.3)",
                          padding:       "2px 8px",
                          borderRadius:  "2px",
                          display:       "inline-block",
                        }}
                      >
                        Recommended
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  <h3
                    style={{
                      fontFamily:    "var(--font-display)",
                      fontSize:      tokens.fontSizes.h3,
                      fontWeight:    tokens.weightHeading,
                      letterSpacing: "-0.015em",
                      color:         colors.textPrimary,
                    }}
                  >
                    {service.name}
                  </h3>

                  {/* Divider below plan name */}
                  <div
                    style={{
                      height:       "2px",
                      borderRadius: "1px",
                      margin:       "12px 0 16px",
                      background: service.featured
                        ? "rgba(252, 163, 17, 0.6)"
                        : "rgba(252, 163, 17, 0.3)",
                    }}
                  />

                  {/* Tagline */}
                  {service.tagline && (
                    <p
                      style={{
                        fontFamily:    "var(--font-display)",
                        fontSize:      "12px",
                        fontWeight:    tokens.weightUI,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color:         colors.textSecondary,
                        marginBottom:  "1rem",
                      }}
                    >
                      {service.tagline}
                    </p>
                  )}

                  {/* Content area — grows to fill, pushes price to bottom */}
                  <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    {/* Description */}
                    <p
                      style={{
                        fontFamily:   "var(--font-body)",
                        fontSize:     "0.875rem",
                        lineHeight:   1.6,
                        fontWeight:   tokens.weightBody,
                        color:        colors.textSecondaryLight,
                        marginBottom: "2rem",
                      }}
                    >
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexGrow: 1 }}>
                        {service.features.map((feat) => (
                          <li
                            key={feat}
                            style={{
                              display:    "flex",
                              alignItems: "center",
                              gap:        "0.75rem",
                              fontSize:   "0.875rem",
                              fontFamily: "var(--font-body)",
                              fontWeight: tokens.weightBody,
                              color:      colors.textSecondaryLight,
                            }}
                          >
                            <span
                              aria-hidden="true"
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize:   tokens.fontSizes.body,
                                fontWeight: tokens.weightBody,
                                color:      colors.accent,
                                lineHeight: 1,
                                flexShrink: 0,
                              }}
                            >
                              —
                            </span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Price row — always pinned to bottom */}
                  <div
                    style={{
                      display:        "flex",
                      alignItems:     "flex-end",
                      justifyContent: "space-between",
                      marginTop:      "1.5rem",
                      paddingTop:     "1.5rem",
                      borderTop:      "1px solid rgba(41, 68, 126, 0.4)",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize:   "20px",
                          fontWeight: tokens.weightHeading,
                          color:      colors.accent,
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
                            color:      colors.textSecondaryLight,
                            marginTop:  "2px",
                          }}
                        >
                          /{service.billingPeriod}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/contact"
                      style={{
                        display:        "flex",
                        alignItems:     "center",
                        gap:            "0.5rem",
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

                  {/* Bottom texture strip */}
                  <div
                    aria-hidden="true"
                    className="sand-texture"
                    style={{
                      position:      "absolute",
                      bottom:        0,
                      left:          0,
                      right:         0,
                      height:        "60px",
                      pointerEvents: "none",
                    }}
                  />
                </div>

            ))}
          </div>

        </div>
      </section>
    </>
  );
}
