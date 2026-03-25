interface Props {
  approachHeadline?: string;
}

const steps = [
  {
    number: "01",
    title: "Discovery",
    body: "We start with a conversation about your business, your goals, and your audience. No templates, no assumptions — just listening.",
  },
  {
    number: "02",
    title: "Design",
    body: "Custom layouts and visual direction built specifically for your brand. You'll review and approve before a single line of code is written.",
  },
  {
    number: "03",
    title: "Build",
    body: "Development in Next.js with clean, maintainable code. Fast by default, performance is baked in, not bolted on.",
  },
  {
    number: "04",
    title: "Launch",
    body: "Thorough QA, cross-browser testing, and a smooth handoff. Your site goes live on Vercel, zero downtime, instant global delivery.",
  },
  {
    number: "05",
    title: "Maintain",
    body: "Ongoing support, content updates, and performance monitoring. We don't disappear after launch, we stay in your corner.",
  },
];

export default function Approach({ approachHeadline }: Props) {
  return (
    <section className="py-24 lg:py-32" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div
            style={{ width: "32px", height: "1px", background: "#c41e3a" }}
          />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color: "#c41e3a",
            }}
          >
            How We Work
          </span>
        </div>

        <h2
          className="mb-16"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            color: "#f2f2f0",
            maxWidth: "600px",
          }}
        >
          {approachHeadline ?? "A process built around your success."}
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 py-8 lg:py-0 lg:px-6"
              style={{
                borderTop: "1px solid #1c1c1c",
                borderLeft: i > 0 ? "1px solid #1c1c1c" : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#c41e3a",
                  letterSpacing: "0.1em",
                }}
              >
                {step.number}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(16px, 1.4vw, 20px)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#f2f2f0",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "#888888",
                  lineHeight: 1.75,
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
