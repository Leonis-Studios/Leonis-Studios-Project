import Link from "next/link";
import siteConfig from "@/site.config";

// Footer is a Server Component (no "use client") because it
// has no interactivity — it just renders static content.
// Server Components are the default in Next.js App Router
// and are better for performance since they render on the
// server and send plain HTML to the browser.

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 border-t border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* ── Brand ───────────────────────────────────────── */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 bg-crimson" />
              <span
                className="text-white text-sm tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
              >
                Leonis <span className="text-crimson">Studios</span>
              </span>
            </div>
            <p
              className="text-neutral-400 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              {siteConfig.description}
            </p>
          </div>

          {/* ── Navigation ──────────────────────────────────── */}
          <div>
            <p
              className="text-white text-xs tracking-[0.2em] uppercase mb-5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Navigate
            </p>
            <ul className="space-y-3">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ─────────────────────────────────────── */}
          <div>
            <p
              className="text-white text-xs tracking-[0.2em] uppercase mb-5"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-neutral-400 hover:text-crimson text-sm transition-colors duration-200"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span
                  className="text-neutral-400 text-sm"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {siteConfig.location}
                </span>
              </li>
              {siteConfig.social.github && (
                <li>
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-crimson text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                  >
                    GitHub ↗
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="pt-8 border-t border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-neutral-400 text-xs tracking-widest"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {/* The crimson dot is a subtle brand touch —
              it echoes the square logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-crimson" />
            <p
              className="text-neutral-400 text-xs tracking-widest"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Built by Leonis Studios
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}