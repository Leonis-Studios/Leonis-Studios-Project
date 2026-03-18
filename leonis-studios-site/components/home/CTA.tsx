import Link from "next/link";

export default function CTA() {
  return (
    <section className="bg-black py-24 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-crimson" />
              <span
                className="text-crimson text-xs tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
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
                color:         "var(--color-white)",
              }}
            >
              Let's build something worth talking about.
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p
              className="text-neutral-400 text-sm leading-relaxed lg:text-right max-w-sm"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Tell us about your project and we'll come back within
              24 hours with a plan and a quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="
                  inline-flex items-center justify-center gap-3
                  px-8 py-4 bg-crimson text-white
                  hover:bg-crimson-dark transition-colors duration-200
                  group
                "
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                <span>Get In Touch</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
              <Link
                href="/work"
                className="
                  inline-flex items-center justify-center gap-3
                  px-8 py-4 border border-neutral-700 text-white
                  hover:border-neutral-400 transition-colors duration-200
                "
                style={{
                  fontFamily:    "var(--font-display)",
                  fontSize:      "13px",
                  fontWeight:    600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
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