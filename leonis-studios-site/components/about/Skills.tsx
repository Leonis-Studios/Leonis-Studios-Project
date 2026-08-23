"use client";
// "use client" is required here because tags are now click-to-expand:
//   - useState (which tag is open, per column)
//   - useRef + useEffect + canvas (one-shot sand-sweep animation per panel open)
// Data still arrives as props from the Server Component parent (app/(site)/about/page.tsx),
// which fetches it from Sanity — see aboutPage.techStack / aboutPage.servicesList in the schema.

import { useRef, useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import SandGutter from "@/components/SandGutter";

interface Tag {
  label:       string;
  description: string;
}

interface Props {
  eyebrow?: string;
  techStack?: Tag[];
  servicesList?: Tag[];
}

const DEFAULT_TECHNOLOGIES: Tag[] = [
  { label: "Next.js", description: "Next.js is the framework we build almost every site on. It renders pages fast, handles routing and image optimization out of the box, and gives search engines clean, crawlable pages instead of a slow client-side app." },
  { label: "TypeScript", description: "TypeScript adds real structure to our code, catching mistakes before they ever reach your site. It means fewer bugs slip through and every feature we build is easier to maintain down the road." },
  { label: "React", description: "React is the library that powers the interactive parts of your site, things like hover states, forms, and animations. It has been the industry standard for years, so your site stays easy to hand off or extend later." },
  { label: "Tailwind CSS", description: "Tailwind CSS lets us build custom designs quickly without a mess of leftover styles. It keeps the codebase lean, which means faster load times for your visitors." },
  { label: "Framer Motion", description: "Framer Motion handles the smoother, more deliberate animations you see across a site, things a plain CSS transition cannot pull off. Used well, it makes a site feel considered instead of gimmicky." },
  { label: "Sanity CMS", description: "Sanity CMS is what lets you edit your own content, from headlines to blog posts, without touching code. It updates your live site instantly and it is the same system powering the words on this page." },
  { label: "Vercel", description: "Vercel is where we host and deploy your site. It keeps things fast worldwide, handles traffic spikes without extra setup, and ships updates the moment we push them." },
  { label: "Resend", description: "Resend handles the emails your site sends, like contact form notifications, reliably and without landing in spam. It is a small piece, but it is one of those things you only notice if it breaks." },
  { label: "PostgreSQL", description: "PostgreSQL is the database we reach for when a project needs to store and query structured data reliably. It has been trusted for decades and scales well as a business grows." },
  { label: "Git", description: "Git tracks every change we make to your codebase. It means nothing gets lost, changes can be reviewed before they go live, and we always have a clean history to fall back on." },
];

const DEFAULT_SERVICES: Tag[] = [
  { label: "Web Design", description: "We design every site around your brand and your customers, not a template. The goal is a site that looks like you and makes it obvious what you do within a few seconds." },
  { label: "Frontend Development", description: "This is the actual building of your site, turning design into a fast, working product. We write clean code that holds up as your site grows." },
  { label: "CMS Integration", description: "We connect your site to a content system so you can update text, images, and posts yourself. No developer needed for the everyday changes." },
  { label: "SEO Optimization", description: "We structure every page so Google can crawl it, understand it, and rank it for the searches that actually bring you customers. This covers technical SEO, on-page content, and site structure together." },
  { label: "GEO Optimization", description: "GEO, or generative engine optimization, is about showing up inside AI-generated answers and AI-powered search results, not just traditional listings. We structure your content so tools built on generative AI can find it and use it." },
  { label: "AEO Optimization", description: "AEO, or answer engine optimization, is about getting your business cited directly inside tools like ChatGPT and Perplexity when someone asks a relevant question. We write and structure content specifically so those answer engines can pull it accurately." },
  { label: "Performance Audits", description: "We regularly check load times, Core Web Vitals, and technical health, then fix what is holding your site back. A slow site loses visitors and ranks lower, so this is not optional." },
  { label: "Site Maintenance", description: "Ongoing updates, security checks, and small content changes so your site stays healthy after launch. You are never left figuring things out on your own." },
  { label: "Analytics Setup", description: "We set up analytics and search console so you can actually see who is visiting, where they come from, and what is working. Data instead of guesswork." },
  { label: "Email Infrastructure", description: "We set up reliable email delivery for contact forms and notifications, so messages from your site actually reach your inbox instead of getting lost." },
];

interface SweepGrain {
  x:            number;
  startY:       number;
  travel:       number;
  r:            number;
  baseAlpha:    number;
  delay:        number;
  fallDuration: number;
}

const SWEEP_COLOR = "180,110,0";

function makeSweepGrains(w: number, h: number): SweepGrain[] {
  const count = Math.round((w * h) / 1800);
  const grains: SweepGrain[] = [];
  for (let i = 0; i < count; i++) {
    grains.push({
      x:            Math.random() * w,
      startY:       Math.random() * h * 0.7,
      travel:       h * (0.4 + Math.random() * 0.5),
      r:            0.5 + Math.random() * 1.3,
      baseAlpha:    0.15 + Math.random() * 0.35,
      delay:        Math.random() * 220,
      fallDuration: 260 + Math.random() * 260,
    });
  }
  return grains;
}

function TagPanel({ item }: { item: Tag }) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCanvas, setShowCanvas] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setShowCanvas(false);
      return;
    }

    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = wrap.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const grains = makeSweepGrains(w, h);
    const maxEnd = Math.max(...grains.map((g) => g.delay + g.fallDuration), 0);
    const start = performance.now();
    let rafId = 0;

    function frame(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, w, h);

      for (const g of grains) {
        const local = elapsed - g.delay;
        if (local <= 0) {
          ctx!.beginPath();
          ctx!.arc(g.x, g.startY, g.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${SWEEP_COLOR},${g.baseAlpha.toFixed(3)})`;
          ctx!.fill();
          continue;
        }
        const t = Math.min(local / g.fallDuration, 1);
        const y = g.startY + g.travel * t;
        const alpha = g.baseAlpha * (1 - t);
        if (alpha > 0.004) {
          ctx!.beginPath();
          ctx!.arc(g.x, y, g.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${SWEEP_COLOR},${alpha.toFixed(3)})`;
          ctx!.fill();
        }
      }

      if (elapsed < maxEnd + 100) {
        rafId = requestAnimationFrame(frame);
      } else {
        setShowCanvas(false);
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden mt-4 p-6"
      style={{
        background: colors.duneSurface,
        border:     `1px solid ${colors.duneDivider}`,
        animation:  "skillPanelIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {/* Dune ridge-line — decorative "sand dune" media behind the paragraph */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, pointerEvents: "none" }}
        preserveAspectRatio="none"
        viewBox="0 0 400 120"
      >
        <path d="M0 80 C 60 60, 100 95, 170 75 S 280 55, 400 80 L400 120 L0 120 Z" fill="rgba(180,110,0,0.10)" />
        <path d="M0 100 C 80 88, 150 105, 230 92 S 340 80, 400 100 L400 120 L0 120 Z" fill="rgba(180,110,0,0.07)" />
      </svg>

      {showCanvas && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}
        />
      )}

      <p
        className="relative text-sm leading-relaxed"
        style={{
          zIndex:     1,
          fontFamily: "var(--font-body)",
          fontWeight: tokens.weightBody,
          fontSize:   tokens.fontSizes.body,
          color:      colors.textSubtle,
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

function TagRow({
  items,
  selected,
  onSelect,
  variant,
}: {
  items:    Tag[];
  selected: string | null;
  onSelect: (label: string) => void;
  variant:  "tech" | "service";
}) {
  const baseColor = variant === "tech" ? colors.bgDark : colors.textSubtle;

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const isOpen = selected === item.label;
        return (
          <button
            key={item.label}
            type="button"
            className="leo-tag-btn"
            aria-expanded={isOpen}
            onClick={() => onSelect(item.label)}
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "12px",
              fontWeight:    tokens.weightUI,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:         isOpen ? colors.bgLight : baseColor,
              background:    isOpen ? baseColor : "transparent",
              border:        `1px solid ${baseColor}`,
              padding:       "8px 16px",
              display:       "inline-block",
              cursor:        "pointer",
              transition:    "background 0.2s ease, color 0.2s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease, border-color 0.25s ease",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default function Skills({ eyebrow: eyebrowProp, techStack, servicesList }: Props) {
  const eyebrow = eyebrowProp || "Stack & Services";
  const technologies = (techStack && techStack.length > 0) ? techStack : DEFAULT_TECHNOLOGIES;
  const services = (servicesList && servicesList.length > 0) ? servicesList : DEFAULT_SERVICES;

  const [openTech, setOpenTech]       = useState<string | null>(null);
  const [openService, setOpenService] = useState<string | null>(null);

  const activeTech    = technologies.find((t) => t.label === openTech) ?? null;
  const activeService = services.find((s) => s.label === openService) ?? null;

  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: colors.bgLight, borderTop: `1px solid ${colors.borderLight}`, position: "relative", zIndex: 1, overflow: "hidden" }}
    >
      <SandGutter seed={0} />
      <style>{`
        @keyframes skillPanelIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .leo-tag-btn {
          position: relative;
          overflow: hidden;
        }
        .leo-tag-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          background-image:
            radial-gradient(circle at 12% 30%, rgba(180,110,0,0.55) 0.6px, transparent 0.6px),
            radial-gradient(circle at 34% 70%, rgba(180,110,0,0.45) 0.5px, transparent 0.5px),
            radial-gradient(circle at 58% 25%, rgba(180,110,0,0.5) 0.7px, transparent 0.7px),
            radial-gradient(circle at 78% 65%, rgba(180,110,0,0.4) 0.5px, transparent 0.5px),
            radial-gradient(circle at 90% 35%, rgba(180,110,0,0.5) 0.6px, transparent 0.6px);
          background-size: 18px 18px;
        }
        .leo-tag-btn:hover {
          border-color: rgba(180,110,0,0.6) !important;
        }
        .leo-tag-btn:hover::before {
          opacity: 1;
        }
        @media (prefers-reduced-motion: no-preference) {
          .leo-tag-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 14px rgba(180,110,0,0.25);
          }
        }
        .leo-tag-panel-wrap {
          display: grid;
          transition: grid-template-rows 0.4s cubic-bezier(0.16,1,0.3,1);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div style={{ width: "32px", height: "1px", background: colors.textSubtle }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color:      colors.textSubtle,
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Technologies */}
          <div>
            <h3
              className="mb-8"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      tokens.fontSizes.h3,
                fontWeight:    tokens.weightHeading,
                letterSpacing: "-0.015em",
                color:         colors.bgDark,
              }}
            >
              Technologies
            </h3>
            <TagRow
              items={technologies}
              selected={openTech}
              variant="tech"
              onSelect={(label) => setOpenTech((prev) => (prev === label ? null : label))}
            />
            <div
              className="leo-tag-panel-wrap"
              style={{ gridTemplateRows: activeTech ? "1fr" : "0fr" }}
            >
              <div style={{ overflow: "hidden" }}>
                {activeTech && <TagPanel key={activeTech.label} item={activeTech} />}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3
              className="mb-8"
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      tokens.fontSizes.h3,
                fontWeight:    tokens.weightHeading,
                letterSpacing: "-0.015em",
                color:         colors.bgDark,
              }}
            >
              Services
            </h3>
            <TagRow
              items={services}
              selected={openService}
              variant="service"
              onSelect={(label) => setOpenService((prev) => (prev === label ? null : label))}
            />
            <div
              className="leo-tag-panel-wrap"
              style={{ gridTemplateRows: activeService ? "1fr" : "0fr" }}
            >
              <div style={{ overflow: "hidden" }}>
                {activeService && <TagPanel key={activeService.label} item={activeService} />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
