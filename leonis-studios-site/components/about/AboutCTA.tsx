import Link from "next/link";

export default function AboutCTA() {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "#0a0a0a", borderTop: "1px solid #1c1c1c" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div style={{ width: "32px", height: "1px", background: "#c41e3a" }} />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  color:      "#c41e3a",
                }}
              >
                Ready to start?
              </span>
            </div>
            <h2
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(32px, 5vw, 64px)",
                fontWeight:    800,
                lineHeight:    0.95,
                letterSpacing: "-0.025em",
                color:         "#f2f2f0",
              }}
            >
              Ready to work<br />
              <span style={{ color: "#c41e3a" }}>together?</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p
              className="lg:text-right max-w-sm"
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "15px",
                fontWeight: 300,
                color:      "#888888",
                lineHeight: 1.75,
              }}
            >
              Tell me about your project and I&apos;ll get back to you
              within 24 hours with a plan and a quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 group"
                style={{
                  background:    "#c41e3a",
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "#f2f2f0",
                }}
              >
                <span>Start a Project</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-3 px-8 py-4"
                style={{
                  border:        "1px solid #2a2a2a",
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         "#f2f2f0",
                }}
              >
                See Our Work
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
