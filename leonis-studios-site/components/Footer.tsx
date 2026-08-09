import Link from "next/link";
import Image from "next/image";
import siteConfig from "@/site.config";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/lib/types";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

// Footer is a Server Component (no "use client") because it
// has no interactivity — it just renders static content.
// Server Components are the default in Next.js App Router
// and are better for performance since they render on the
// server and send plain HTML to the browser.

export default async function Footer() {
  const year = new Date().getFullYear();

  const settings: SiteSettings | null = await client
    .fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const email    = settings?.email    ?? siteConfig.email;
  const location = settings?.location ?? siteConfig.location;

  return (
    <footer className="bg-neutral-800 border-t border-neutral-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* ── Brand ───────────────────────────────────────── */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo-white.png"
                alt="Leonis Studios"
                width={196}
                height={56}
                style={{ height: "56px", width: "auto" }}
              />
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textSecondaryLight }}
            >
              {siteConfig.description}
            </p>
          </div>

          {/* ── Navigation ──────────────────────────────────── */}
          <div>
            <p
              className="text-white text-xs tracking-[0.2em] uppercase mb-5"
              style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI }}
            >
              Navigate
            </p>
            <ul className="space-y-3">
              {siteConfig.nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textSecondaryLight }}
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
              style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI }}
            >
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-sm transition-colors duration-200"
                  style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textSecondaryLight }}
                >
                  {email}
                </a>
              </li>
              <li>
                <span
                  className="text-sm"
                  style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textSecondaryLight }}
                >
                  {location}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="pt-8 border-t border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs tracking-widest"
            style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody, color: colors.textSecondaryLight }}
          >
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {/* The crimson dot is a subtle brand touch —
              it echoes the square logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5" style={{ background: colors.accent }} />
            <p
              className="text-neutral-400 text-xs tracking-widest"
              style={{ fontFamily: "var(--font-body)", fontWeight: tokens.weightBody }}
            >
              Built by Leonis Studios
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}