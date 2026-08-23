"use client";

import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

type Status = "idle" | "loading" | "success" | "error";

// Cuts the top-right and bottom-left corners — same two-facet gem cut used
// on the about page's Values cards, carried over here for a consistent
// bedrock/gem language between the two rewritten sections.
const GEM_CLIP = "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))";
// Small rotated-square "diamond" marker used for the info rail's vein nodes and bullets.
const BADGE_CLIP_SMALL = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

const SERVICE_OPTIONS = [
  "Web Design",
  "Development",
  "SEO Optimization",
  "Site Maintenance",
  "Other",
];

const BUDGET_OPTIONS = ["Under $2k", "$2k – $5k", "$5k – $10k", "$10k+"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: colors.bgLight,
  border: `1px solid ${colors.borderLight}`,
  padding: "14px 16px",
  fontFamily: "var(--font-body)",
  fontSize: "14px",
  color: colors.bgDark,
  outline: "none",
  display: "block",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "11px",
  fontWeight: tokens.weightUI,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: colors.textSubtle,
  display: "block",
  marginBottom: "8px",
};

export default function ContactSection({
  siteEmail,
  location,
}: {
  siteEmail: string;
  location: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [glintDone, setGlintDone] = useState(false);
  const { ref: infoRef, inView: infoIn } = useInViewOnce<HTMLDivElement>(0.2);
  const { ref: panelRef, inView: panelIn } = useInViewOnce<HTMLDivElement>(0.15);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  function toggleService(s: string) {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          services,
          budget,
          details,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section className="py-24 lg:py-32" style={{ background: colors.bgLight, position: "relative", zIndex: 1, overflow: "hidden" }}>
      <SandGutter seed={0} />
      <style>{`
        input::placeholder,
        textarea::placeholder { color: ${colors.textSecondary}; }
        input, textarea {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 0 0 rgba(252,163,17,0);
        }
        input:focus,
        textarea:focus {
          border-color: ${colors.bgDark} !important;
          box-shadow: 0 0 0 3px rgba(252,163,17,0.18);
        }
        @keyframes settle {
          0%   { opacity: 0; transform: translateY(-10px) scale(0.6); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(6px) scale(1); }
        }
        @keyframes panelGlint {
          from { transform: translateX(-160%) skewX(-12deg); opacity: 0; }
          20%  { opacity: 0.8; }
          to   { transform: translateX(220%) skewX(-12deg); opacity: 0; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          {/* ── Left: Info ─────────────────────────────────────── */}
          <div ref={infoRef} className="lg:col-span-2" style={{ position: "relative" }}>
            {/* Sedimentary strata — faint bedrock bands behind the info rail */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", inset: "-20px -16px auto -16px", height: "220px", zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", left: 0, right: "22%", top: "18%", height: "12px", background: colors.bgMuted, opacity: infoIn ? 0.5 : 0, transition: "opacity 1s ease 0.15s" }} />
              <div style={{ position: "absolute", left: "10%", right: 0, top: "55%", height: "9px", background: "rgba(180,110,0,0.1)", opacity: infoIn ? 1 : 0, transition: "opacity 1s ease 0.35s" }} />
            </div>

            <div className="flex items-center gap-4 mb-10" style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{ width: "32px", height: "1px", background: colors.textSubtle }}
              />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                  color: colors.textSubtle,
                }}
              >
                Get in Touch
              </span>
            </div>

            <div className="flex flex-col gap-10" style={{ position: "relative", zIndex: 1 }}>
              {/* Contact details — a gold vein connects each fact like a mineral seam */}
              <div className="flex flex-col gap-6" style={{ position: "relative", paddingLeft: "22px" }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "3px",
                    top: "6px",
                    bottom: "6px",
                    width: "1px",
                    background: "linear-gradient(to bottom, rgba(180,110,0,0.5), rgba(180,110,0,0.08))",
                    transform: infoIn ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "top",
                    transition: "transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
                  }}
                />
                {[
                  { label: "Email", value: siteEmail, href: `mailto:${siteEmail}` },
                  { label: "Location", value: location },
                  { label: "Response Time", value: "Within 24 hours" },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    style={{
                      position:   "relative",
                      opacity:    infoIn ? 1 : 0,
                      transform:  infoIn ? "translateX(0)" : "translateX(-10px)",
                      transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${infoIn ? 0.25 + i * 0.12 : 0}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${infoIn ? 0.25 + i * 0.12 : 0}s`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: "-22px",
                        top: "7px",
                        width: "7px",
                        height: "7px",
                        background: colors.accent,
                        clipPath: BADGE_CLIP_SMALL,
                      }}
                    />
                    <p style={{ ...labelStyle, marginBottom: "4px" }}>{row.label}</p>
                    {row.href ? (
                      <a
                        href={row.href}
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px",
                          fontWeight: tokens.weightBody,
                          color: colors.bgDark,
                          textDecoration: "none",
                        }}
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px",
                          fontWeight: tokens.weightBody,
                          color: colors.bgDark,
                        }}
                      >
                        {row.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* What to expect */}
              <div
                style={{
                  borderTop: `1px solid ${colors.borderLight}`,
                  paddingTop: "32px",
                }}
              >
                <p
                  style={{
                    ...labelStyle,
                    marginBottom: "16px",
                  }}
                >
                  What to Expect
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "A response within one business day",
                    "No pushy sales tactics, just an honest conversation",
                    "A clear outline of scope, timeline, and pricing",
                    "Direct communication, start to finish",
                  ].map((item, i) => (
                    <li
                      key={item}
                      className="flex items-start gap-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: tokens.weightSecondary,
                        color: colors.textSubtle,
                        lineHeight: 1.6,
                        opacity:    infoIn ? 1 : 0,
                        transform:  infoIn ? "translateX(0)" : "translateX(-10px)",
                        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${infoIn ? 0.6 + i * 0.08 : 0}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${infoIn ? 0.6 + i * 0.08 : 0}s`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          marginTop: "6px",
                          flexShrink: 0,
                          background: "rgba(180,110,0,0.6)",
                          clipPath: BADGE_CLIP_SMALL,
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: Form — cut into a single faceted gem panel ─ */}
          <div
            ref={panelRef}
            className="lg:col-span-3"
            style={{
              position: "relative",
              clipPath: GEM_CLIP,
              background: `linear-gradient(155deg, rgba(180,110,0,0.05), ${colors.bgCard})`,
              border: `1px solid rgba(180,110,0,0.22)`,
              padding: "40px clamp(24px, 4vw, 44px)",
              opacity: panelIn ? 1 : 0,
              transform: panelIn ? "translateY(0) scale(1)" : "translateY(16px) scale(0.985)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Mounted only while playing — unmounts itself on completion (rather
                than relying on fill-mode) so there's no resting frame that could
                snap back to a stuck-opaque overlay across the form. */}
            {panelIn && !reducedMotion && !glintDone && (
              <span
                aria-hidden="true"
                onAnimationEnd={() => setGlintDone(true)}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "60%",
                  background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.5) 45%, transparent)",
                  animation: "panelGlint 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s 1",
                  pointerEvents: "none",
                }}
              />
            )}
            {status === "success" ? (
              /* Success state */
              <div
                className="flex flex-col gap-6 py-16"
                style={{
                  borderTop: `2px solid ${colors.accent}`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    border: `2px solid ${colors.accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <span style={{ color: colors.textSubtle, fontSize: "20px" }}>✓</span>
                  {/* Sand-settle flourish — grains fall and fade once, around the checkmark */}
                  {!reducedMotion && Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        left: `${8 + (i * 37) % 100}%`,
                        top: `${-10 - (i % 4) * 6}px`,
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "rgba(180,110,0,0.7)",
                        animation: `settle ${0.6 + (i % 5) * 0.08}s ease ${(i % 6) * 0.05}s 1 forwards`,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: tokens.weightDisplay,
                    letterSpacing: "-0.02em",
                    color: colors.bgDark,
                  }}
                >
                  Message sent.
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: tokens.weightBody,
                    color: colors.textSubtle,
                    lineHeight: 1.75,
                    maxWidth: "400px",
                  }}
                >
                  Thanks for reaching out. I&apos;ll review your project details
                  and get back to you within 24 hours.
                </p>
              </div>
            ) : (
              /* Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-8"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" style={labelStyle}>
                      Name <span style={{ color: colors.textSubtle }}>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Email <span style={{ color: colors.textSubtle }}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" style={labelStyle}>
                    Company / Website
                  </label>
                  <input
                    id="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your company or current website URL"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {/* Services */}
                <div>
                  <p style={labelStyle}>Services Needed</p>
                  <div className="flex flex-wrap gap-3">
                    {SERVICE_OPTIONS.map((s) => {
                      const selected = services.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "12px",
                            fontWeight: tokens.weightUI,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "10px 18px",
                            border: selected
                              ? `1px solid ${colors.accent}`
                              : `1px solid ${colors.borderLight}`,
                            background: selected ? colors.accent : "transparent",
                            color: selected ? colors.bgLight : colors.textSubtle,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <p style={labelStyle}>Budget Range</p>
                  <div className="flex flex-wrap gap-3">
                    {BUDGET_OPTIONS.map((b) => {
                      const selected = budget === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(selected ? "" : b)}
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "12px",
                            fontWeight: tokens.weightUI,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "10px 18px",
                            border: selected
                              ? `1px solid ${colors.bgDark}`
                              : `1px solid ${colors.borderLight}`,
                            background: selected ? colors.bgDark : "transparent",
                            color: selected ? colors.bgLight : colors.textSubtle,
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project details */}
                <div>
                  <label htmlFor="details" style={labelStyle}>
                    Project Details <span style={{ color: colors.textSubtle }}>*</span>
                  </label>
                  <textarea
                    id="details"
                    required
                    rows={6}
                    placeholder="Tell me about your project, goals, timeline, or anything else relevant."
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "160px",
                    }}
                  />
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div
                    style={{
                      padding: "14px 16px",
                      background: colors.errorBg,
                      border: `1px solid ${colors.accent}`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: colors.textSubtle,
                        margin: 0,
                      }}
                    >
                      {errorMsg} If the problem persists, email us directly at{" "}
                      <a
                        href={`mailto:${siteEmail}`}
                        style={{ color: colors.textSubtle, fontWeight: tokens.weightUI }}
                      >
                        {siteEmail}
                      </a>
                      .
                    </p>
                  </div>
                )}

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center gap-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: tokens.weightUI,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "16px 36px",
                      background: status === "loading" ? colors.textSecondary : colors.accent,
                      color: colors.bgLight,
                      border: "none",
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      transition: "background 0.2s",
                    }}
                  >
                    {status === "loading" ? "Sending…" : "Send Message →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
