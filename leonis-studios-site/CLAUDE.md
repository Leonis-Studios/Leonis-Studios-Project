# Leonis Studios — Claude Code Reference

Project root: `c:\next.js\business\Leonis-Studios-Project\leonis-studios-site`

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server + Client Components) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + inline `style` props via design tokens |
| CMS | Sanity v5 (Studio at `/studio`, schemas in `sanity/schemaTypes/`) |
| Email | Resend v6 (contact form submissions) |
| Animation | CSS `@keyframes` inline + `framer-motion` (available but used sparingly) |
| Images | `next/image` — remote patterns: `cdn.sanity.io` |
| Fonts | `var(--font-display)` (display/headings), `var(--font-body)` (body copy) |

---

## Design Tokens

### Colors — `lib/colors.ts`

Always import from `@/lib/colors`. Never hardcode hex values inline.

```
bgDark:             #14213d   — primary dark / section bg
bgBlack:            #000000   — pure black (hero, CTA, navbar)
bgLight:            #ffffff   — white (Services section)
bgMuted:            #e5e5e5   — light gray (FeaturedWork section)
bgCard:             #fafafa   — card surface
surfaceDark:        #0c1425   — HowItWorks step card bg
surfaceAccent:      #29447e   — step number color, hover overlays
borderDark:         #29447e   — HowItWorks grid gap color
borderLight:        #e5e5e5   — dividers on light bg
accent:             #fca311   — primary gold (buttons, rules, highlights)
textPrimary:        #ffffff
textSecondary:      #BCCEF0   — light blue (replaced old #2751ac)
textMuted:          #375ba7
textBody:           #14213d
textSubtle:         #29447e
textMutedLight:     #1a1a1a
textNav:            #999999
textNavAccent:      #fca311
textSecondaryLight: #BFCEEE   — body text on dark sections
```

**Gold rules:** Use `#fca311` on dark/black backgrounds. Use `rgba(180,110,0,x)` (dark gold) on white/gray backgrounds — bright gold is near-invisible on light bg.

### Typography — `lib/tokens.ts`

Always import from `@/lib/tokens`. Always set both `fontFamily` and `fontWeight` together.

```
Font families:
  var(--font-display)   — all headings, labels, UI elements, nav
  var(--font-body)      — paragraph/body copy only

Font sizes (fluid with clamp — prefer these over arbitrary values):
  tokens.fontSizes.body       clamp(15px, 1.5vw, 20px)
  tokens.fontSizes.bodyLarge  clamp(16px, 1.6vw, 21px)
  tokens.fontSizes.h3         clamp(19px, 2.2vw, 26px)
  tokens.fontSizes.h3Compact  clamp(16px, 1.5vw, 22px)

Section headlines: fontSize: "clamp(32px, 5vw, 64px)"
Hero headline:     fontSize: "clamp(48px, 9vw, 120px)"

Font weights:
  tokens.weightDisplay  700   — section h2, hero h1
  tokens.weightHeading  600   — card h3
  tokens.weightUI       700   — labels, buttons, nav, eyebrow text
  tokens.weightBody     600   — all <p> body copy
  tokens.weightSecondary 600  — secondary/muted paragraphs
```

---

## Architecture Patterns

### Server vs Client split

- **Server Components**: data fetching (`Services`, `FeaturedWork`, `Footer`). Never add `"use client"` unless browser APIs / state / effects are needed.
- **Client Components**: interactivity only (`ServicesGrid`, `FeaturedWorkGrid`, `HowItWorks`, `Navbar`, `SandGutter`). Add `"use client"` + explain why at the top.
- Pattern: Server parent fetches data → passes as props to Client child (e.g., `Services` → `ServicesGrid`).

### Page layout — `app/(site)/layout.tsx`

```
Navbar (fixed, z-50)
└── main
    ├── [page sections — position: relative, z-index: 1]
    └── Footer
```

The `/studio` route is separate and not wrapped by this layout.

### Section template

Every section that uses `SandGutter` must have:
```tsx
<section style={{ position: "relative", zIndex: 1, overflow: "hidden" }}>
  <SandGutter seed={N} />
  <div className="max-w-7xl mx-auto px-6 lg:px-12">
    {/* content */}
  </div>
</section>
```

---

## Sand Theme

### Overview

Brand identity: lion / desert / golden sand. The `#fca311` accent gold is the primary decorative colour. Animated canvas particle sand grains drift in the page gutters of every content section.

### Component: `components/SandGutter.tsx`

Canvas-based particle animation. Renders drifting gold dots in the left and right gutters (outermost ~100px of the section). Content area is never touched.

Also renders two `position: absolute` vignette `<div>`s (left + right) that fade the section's own background colour into the gutter, creating a grainy dissolve transition. These sit above the canvas via source order, below normal page content.

**Seed map:**

| Seed | Section | Background | Grain colour |
|---|---|---|---|
| 0 | Services | `#fafafa` (white) | Dark gold `180,110,0` |
| 1 | HowItWorks | `#0c1425` (dark) | Bright gold `252,163,17` |
| 2 | FeaturedWork | `#e5e5e5` (gray) | Dark gold `180,110,0` |
| 3 | CTA | `#000000` (black) | Bright gold `252,163,17` |

**Rules:**
- Never place `SandGutter` on the Hero, Marquee, Navbar, or Footer.
- When adding a new section to another page (About, Contact), wrap sections in a SandGutter with the appropriate seed for that section's background.
- See `SAND_THEME.md` for full tuning reference (opacity, speed, path shapes, grain config).

### Z-index reference

```
z-50   Navbar (position: fixed)
z-10   Hero scroll indicator (position: fixed)
z-1    Page sections (position: relative) — their bg covers sand canvas center
z-0    Canvas + vignette divs (position: absolute inside section)
```

---

## Sanity CMS

### Client — `sanity/lib/client.ts`

```ts
import { client } from "@/sanity/lib/client";
const data = await client.fetch(QUERY, params, { next: { revalidate: 3600 } });
```

Always use `revalidate: 3600` (ISR) on page-level fetches. Wrap `.fetch()` calls in `.catch(() => fallback)` for resilience.

### Queries — `sanity/lib/queries.ts`

| Constant | Returns |
|---|---|
| `PACKAGE_SERVICES_QUERY` | Website packages (Services section) |
| `RETAINER_SERVICES_QUERY` | Monthly retainers |
| `ADDON_SERVICES_QUERY` | Add-on services |
| `ALL_SERVICES_QUERY` | All active services |
| `FEATURED_CASE_STUDIES_QUERY` | Top 3 featured projects |
| `ALL_CASE_STUDIES_QUERY` | All case studies |
| `CASE_STUDY_BY_SLUG_QUERY` | Single project page |
| `ALL_CASE_STUDY_SLUGS_QUERY` | Static params generation |
| `SITE_SETTINGS_QUERY` | Global settings |
| `ABOUT_PAGE_QUERY` | About page content |

### Schemas — `sanity/schemaTypes/`

- **`service.ts`** — category: `package | retainer | seo | addon`; tier: `starter | growth | studio | essential | authority | na`; pricing: `startingPrice`, `priceLabel`, `billingPeriod`; display: `featured`, `order`, `active`.
- **`caseStudy.ts`** — title, slug, client, year, summary, services (refs), tags, coverImage, liveUrl, body (Portable Text), results `[{label, value}]`, featured.
- **`siteSettings.ts`** — singleton: siteName, tagline, metaDescription (≤160), email, location, social links.
- **`aboutPage.ts`** — singleton: hero, story (Portable Text), profilePhoto, values `[{title, description}]`, approach, techStack, CTA.

### Types — `lib/types.ts`

Always import types from here. Key interfaces: `Service`, `CaseStudyCard`, `CaseStudy`, `SanityImage`, `SiteSettings`, `AboutPageData`.

---

## SEO

### Metadata pattern (`app/(site)/page.tsx` as reference)

```ts
export const metadata: Metadata = {
  title: "Page Title | Leonis Studios",
  description: "...",           // ≤160 chars
  keywords: [...],
  openGraph: { title, description, url, images: [{ url: ogImage }] },
  twitter: { card: "summary_large_image", ... },
  alternates: { canonical: url },
};
```

- Every page must export a `metadata` object.
- Dynamic routes use `generateMetadata()` with Sanity data.
- Home page includes JSON-LD `Organization` + `WebSite` schemas inline in `<script type="application/ld+json">`.

### Performance

- Use `next/image` for all images. Always supply `width`, `height`, `alt`. Use `priority` on above-fold images.
- `next/link` for all internal navigation.
- Sanity images use `@sanity/image-url` builder — never use raw CDN URLs directly.
- ISR (`revalidate: 3600`) on all Sanity fetches. No `force-dynamic` unless explicitly needed.

---

## Spacing & Layout Conventions

```
Container:         max-w-7xl mx-auto px-6 lg:px-12
Section padding:   py-24 or py-28 (use py-24 as default)
Section header:    mb-16 gap-6 (flex with text + subtitle)
Eyebrow label:     flex items-center gap-4 mb-5 → [8px rule] [text-xs tracking-[0.25em] uppercase accent]
Grid gap:          gap-px with bg={colors.borderLight or borderDark} as gap colour
Card padding:      p-10 (standard), p-8 (compact)
```

---

## Site Configuration — `site.config.ts`

Single source of truth for site metadata, nav links, and social URLs. Always read from here rather than hardcoding strings.

```ts
import siteConfig from "@/site.config";
// siteConfig.name, siteConfig.tagline, siteConfig.url, siteConfig.email
// siteConfig.nav: [{ label, href }]
// siteConfig.social: { github }
```

---

## Common Pitfalls

- **Never hardcode colours.** Always use `colors.*` from `@/lib/colors`.
- **Never hardcode font weights or sizes** except for section headlines (use `clamp(32px, 5vw, 64px)`) and one-off sizes like `"10px"` for eyebrow labels. Use `tokens.*` for everything else.
- **Section backgrounds must cover the canvas center.** If a section has `background: transparent`, the sand canvas will bleed into the content. Always give sections an explicit background.
- **`overflow: hidden` is required** on any section using `SandGutter` — otherwise grains escape the section bounds during scroll.
- **Avoid adding `"use client"` to Server Components.** If you need client interactivity in a server-fetching component, extract a child Client Component.
- **Resend email** is used only in the contact form API route. Do not add client-side email logic.
