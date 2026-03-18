"use client";

// "use client" is required here because this component uses:
//   - useState (to track scroll position and mobile menu state)
//   - useEffect (to add/remove the scroll event listener)
//   - usePathname (to highlight the active nav link)
// All of these are browser/runtime APIs that don't exist
// on the server, so this must be a Client Component.

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import siteConfig from "@/site.config";

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname                  = usePathname();

  // Add a class when the user scrolls down so we can
  // transition the navbar from transparent to solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? "bg-black/95 backdrop-blur-sm border-b border-neutral-800"
          : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* The crimson square is the Leonis visual mark —
                a simple geometric shape that's instantly
                recognisable and scales to any size */}
            <div className="w-7 h-7 bg-crimson group-hover:scale-90 transition-transform duration-200" />
            <span
              className="text-white text-sm tracking-[0.15em] uppercase"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              Leonis
              <span className="text-crimson ml-1">Studios</span>
            </span>
          </Link>

          {/* ── Desktop Nav ─────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.nav.map((link) => {
              // isActive highlights the current page link
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative text-xs tracking-[0.12em] uppercase
                    transition-colors duration-200
                    ${isActive ? "text-white" : "text-neutral-400 hover:text-white"}
                  `}
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {link.label}
                  {/* Crimson underline on active link */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-crimson" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── CTA Button ──────────────────────────────────── */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-2 px-5 py-2.5
                bg-crimson text-white text-xs tracking-[0.12em] uppercase
                hover:bg-crimson-dark transition-colors duration-200
                group
              "
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              <span>Start a Project</span>
              {/* Arrow shifts right on hover for a subtle motion cue */}
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>

          {/* ── Mobile Menu Toggle ──────────────────────────── */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {/* Three lines animate into an X when open */}
            <span
              className={`
                block h-px w-6 bg-white transition-all duration-300 origin-center
                ${menuOpen ? "rotate-45 translate-y-2" : ""}
              `}
            />
            <span
              className={`
                block h-px bg-white transition-all duration-300
                ${menuOpen ? "w-0 opacity-0" : "w-4"}
              `}
            />
            <span
              className={`
                block h-px w-6 bg-white transition-all duration-300 origin-center
                ${menuOpen ? "-rotate-45 -translate-y-2" : ""}
              `}
            />
          </button>

        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────
          Drops down below the header when menuOpen is true.
          Each link closes the menu via the useEffect above.
      ──────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-neutral-800 px-6 py-8 flex flex-col gap-6">
          {siteConfig.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-neutral-400 hover:text-white text-sm tracking-[0.12em] uppercase transition-colors duration-200"
              style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 bg-crimson text-white text-xs tracking-[0.12em] uppercase"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Start a Project →
          </Link>
        </div>
      )}
    </header>
  );
}