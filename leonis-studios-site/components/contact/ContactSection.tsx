"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";

type Status = "idle" | "loading" | "success" | "error";

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
  fontWeight: 600,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: colors.textSubtle,
  display: "block",
  marginBottom: "8px",
};

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
    <section className="py-24 lg:py-32" style={{ background: colors.bgLight }}>
      <style>{`
        input::placeholder,
        textarea::placeholder { color: ${colors.textSecondary}; }
        input:focus,
        textarea:focus { border-color: ${colors.bgDark} !important; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          {/* ── Left: Info ─────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <div
                style={{ width: "32px", height: "1px", background: colors.textSubtle }}
              />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  color: colors.textSubtle,
                }}
              >
                Get in Touch
              </span>
            </div>

            <div className="flex flex-col gap-10">
              {/* Contact details */}
              <div className="flex flex-col gap-6">
                <div>
                  <p style={{ ...labelStyle, marginBottom: "4px" }}>Email</p>
                  <a
                    href={`mailto:hassan.shirazi@leonisstudios.com`}
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      color: colors.bgDark,
                      textDecoration: "none",
                    }}
                  >
                    hassan.shirazi@leonisstudios.com
                  </a>
                </div>
                <div>
                  <p style={{ ...labelStyle, marginBottom: "4px" }}>Location</p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      color: colors.bgDark,
                    }}
                  >
                    New York, USA
                  </p>
                </div>
                <div>
                  <p style={{ ...labelStyle, marginBottom: "4px" }}>
                    Response Time
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      color: colors.bgDark,
                    }}
                  >
                    Within 24 hours
                  </p>
                </div>
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
                    "No pushy sales tactics — just an honest conversation",
                    "A clear outline of scope, timeline, and pricing",
                    "Direct communication, start to finish",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: colors.textSubtle,
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          color: colors.textSubtle,
                          marginTop: "2px",
                          flexShrink: 0,
                        }}
                      >
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              /* Success state */
              <div
                className="flex flex-col gap-6 py-16"
                style={{
                  borderTop: `2px solid ${colors.accent}`,
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
                  }}
                >
                  <span style={{ color: colors.textSubtle, fontSize: "20px" }}>✓</span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 3vw, 36px)",
                    fontWeight: 800,
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
                            fontWeight: 600,
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
                            fontWeight: 600,
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
                        href="mailto:hello@leonistudios.com"
                        style={{ color: colors.textSubtle, fontWeight: 600 }}
                      >
                        hello@leonistudios.com
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
                      fontWeight: 600,
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
