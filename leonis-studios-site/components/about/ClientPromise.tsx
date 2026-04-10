import Link from "next/link";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

const promises = [
  {
    title: "24-Hour Response",
    body: "Every message gets a reply within one business day. No chasing, no silence.",
  },
  {
    title: "Transparent Pricing",
    body: "You'll know the full cost before any work begins. No surprise invoices, ever.",
  },
  {
    title: "You Own Everything",
    body: "All code, assets, and accounts are yours from day one. No lock-in, no hostage files.",
  },
  {
    title: "Built to Last",
    body: "We don't cut corners to hit deadlines. Every site ships clean, tested, and maintainable.",
  },
  {
    title: "Honest Timelines",
    body: "We give you realistic schedules and flag delays early — not the day before launch.",
  },
  {
    title: "Post-Launch Support",
    body: "Every project includes a 14-day post-launch window for fixes and fine-tuning at no extra cost.",
  },
];

export default function ClientPromise() {
  return (
    <section
      aria-label="Leonis Studios client commitments and guarantees"
      className="py-24 lg:py-32"
      style={{ background: colors.bgLight, borderTop: `1px solid ${colors.borderLight}` }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div style={{ width: "32px", height: "1px", background: colors.textSubtle }} />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.textSubtle,
              fontSize: "12px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            Our Promise
          </span>
        </div>

        {/* Heading */}
        <h2
          className="mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: tokens.weightDisplay,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            color: colors.bgDark,
            maxWidth: "600px",
          }}
        >
          What you can always expect.
        </h2>

        {/* Subheading */}
        <p
          className="mb-16"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            fontSize: "15px",
            color: colors.textMuted,
            lineHeight: 1.75,
            maxWidth: "480px",
          }}
        >
          These aren&apos;t aspirations — they&apos;re the baseline for every project we take on.
        </p>

        {/* Promise grid */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: colors.borderLight, listStyle: "none", padding: 0, margin: 0 }}
        >
          {promises.map((p) => (
            <li
              key={p.title}
              style={{
                background: colors.bgCard,
                padding: "32px",
                position: "relative",
              }}
            >
              {/* Accent mark */}
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: colors.accent,
                  marginBottom: "20px",
                }}
              />

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: tokens.weightUI,
                  letterSpacing: "-0.01em",
                  color: colors.bgDark,
                  marginBottom: "10px",
                }}
              >
                {p.title}
              </h3>

              {/* Body */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: tokens.weightBody,
                  fontSize: "14px",
                  color: colors.textMuted,
                  lineHeight: 1.75,
                }}
              >
                {p.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Bottom note */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "12px",
            fontWeight: tokens.weightUI,
            letterSpacing: "0.08em",
            color: colors.textSubtle,
            textAlign: "center",
            marginTop: "48px",
          }}
        >
          Have a specific requirement not listed here?{" "}
          <Link
            href="/contact"
            style={{ color: colors.accent, textDecoration: "none" }}
          >
            Ask us directly
          </Link>
          {" "}— we&apos;ll tell you straight.
        </p>

      </div>
    </section>
  );
}
