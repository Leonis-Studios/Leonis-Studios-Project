export default function Story() {
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "#f2f2f0" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div style={{ width: "32px", height: "1px", background: "#c41e3a" }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color:      "#c41e3a",
            }}
          >
            Our Story
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Pull quote */}
          <div className="lg:sticky lg:top-32">
            <blockquote
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "clamp(26px, 3.5vw, 44px)",
                fontWeight:    800,
                lineHeight:    1.1,
                letterSpacing: "-0.025em",
                color:         "#0a0a0a",
              }}
            >
              Bold work. No fluff.
              <br />
              <span style={{ color: "#c41e3a" }}>No compromise.</span>
            </blockquote>
            <div className="mt-8 w-12 h-px" style={{ background: "#c41e3a" }} />
          </div>

          {/* Story paragraphs */}
          <div className="flex flex-col gap-6">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(15px, 1.3vw, 17px)",
                fontWeight: 400,
                color:      "#2a2a2a",
                lineHeight: 1.8,
              }}
            >
              My name is Hassan Shirazi. I started Leonis Studios because I kept
              seeing the same problem: businesses settling for generic templates,
              slow sites, and agencies that disappear after launch.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(15px, 1.3vw, 17px)",
                fontWeight: 400,
                color:      "#2a2a2a",
                lineHeight: 1.8,
              }}
            >
              The name comes from Leo — the lion. It&apos;s a symbol of precision,
              courage, and doing things with intention. That&apos;s the philosophy
              behind everything this studio produces: work that is deliberate,
              built to perform, and built to last.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(15px, 1.3vw, 17px)",
                fontWeight: 400,
                color:      "#2a2a2a",
                lineHeight: 1.8,
              }}
            >
              Leonis Studios is intentionally small. One person handles every
              project — design, development, SEO, and ongoing maintenance. That
              means no account managers, no hand-offs, no diluted output. You
              work directly with the person building your site, from first call
              to final deployment.
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(15px, 1.3vw, 17px)",
                fontWeight: 400,
                color:      "#2a2a2a",
                lineHeight: 1.8,
              }}
            >
              The clients I work with are small businesses, founders, and growing
              brands who understand that a great website is an investment — not
              a cost. If you value craft and want a site that actually works for
              your business, we&apos;ll get along fine.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
