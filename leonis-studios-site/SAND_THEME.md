# Leonis Studios — Sand Theme Reference

Brand theme: lion / desert / flowing sand. The accent gold `#fca311` is the primary
decorative color. The sand decoration reinforces this through animated, flowing dune
silhouettes that live in the viewport gutters — visible on the left and right sides of
every section from below the Marquee down to the Footer.

---

## How It Works

**Component:** `components/SandDecoration.tsx`
**Used in:** `app/(site)/page.tsx` (home page) — wraps Services → HowItWorks → FeaturedWork → CTA

`SandDecoration` is a client component that:
1. Measures its own height with `ResizeObserver`
2. Renders a full-height `position: absolute` SVG canvas behind all child sections
3. That SVG has 4 animated bezier paths on each side (left + right)
4. Paths morph continuously using CSS `@keyframes` with `d: path(...)` animation
5. Each section has `position: relative; z-index: 1` — their background colors cover the
   center of the canvas, so sand only shows in the gutters outside content bounds

The sand fades in at the top (first 6%) and bottom (last 6%) via SVG gradient mask,
creating smooth dissolves into the Marquee and Footer.

---

## Adding to Another Page (About, Contact, etc.)

Wrap the sections below the hero in `<SandDecoration>`:

```tsx
import SandDecoration from "@/components/SandDecoration";

// In the page return:
<>
  <AboutHero />
  <SandDecoration>
    <Story />
    <Values />
    <ClientPromise />
    <Skills />
    <AboutCTA />
  </SandDecoration>
</>
```

Each section component needs `position: relative; z-index: 1` on its outermost element
(already done for home page sections). Add to new sections as needed:

```tsx
<section style={{ position: "relative", zIndex: 1, /* existing styles */ }}>
```

---

## Tuning the Decoration

### Opacity (how visible the sand is)

Edit `fillOpacity` / `strokeOpacity` on the `<path>` elements in `SandDecoration.tsx`:

| Element | Property | Default | Effect |
|---------|----------|---------|--------|
| Primary fill (L1/R1) | `fillOpacity` | `0.13` | Main dune body |
| Secondary fill (L2/R2) | `fillOpacity` | `0.08` | Depth layer |
| Crest stroke (L3/R3) | `strokeOpacity` | `0.30` | Bright ridge line |
| Wisp stroke (L4/R4) | `strokeOpacity` | `0.15` | Secondary flow |

Increase all by ~0.05 to make sand more prominent on light-background sections.

### Per-Seed Alpha & Color (`SandGutter.tsx`)

`SandGutter` uses `alphaMult` and `color` in `SEED_CFG` to adapt particle visibility per section background:

| Seed | Section | Background | `alphaMult` | `color` |
|------|---------|-----------|------------|---------|
| 0 | Services | `bg-white` | `4.5` | `180,110,0` (dark gold) |
| 1 | HowItWorks | `#14213d` (dark) | `1.5` | `252,163,17` (bright gold) |
| 2 | FeaturedWork | `#e5e5e5` (gray) | `4.0` | `180,110,0` (dark gold) |
| 3 | CTA | `bg-black` | `1.5` | `252,163,17` (bright gold) |

**Why two gold colors:** bright `#fca311` is near-invisible on white/gray. Dark gold `#b46e00` (RGB `180,110,0`) reads clearly on light backgrounds while still feeling warm and on-brand.

To adjust per section: edit `alphaMult` (float multiplier on base alpha 0.12–0.32) or `color` (RGB string, no `rgba()` wrapper) in the `SEED_CFG` array.

### Animation Speed

Each path has its own duration in the `<style>` block inside `SandDecoration.tsx`:

```css
.sand-l1 { animation: sandL1 28s ease-in-out infinite; }   /* slowest */
.sand-l3 { animation: sandL3 18s ease-in-out infinite; }   /* fastest */
.sand-l4 { animation: sandL4 32s ease-in-out infinite; }   /* ultra slow */
```

Lower number = faster morph. Right-side paths have slight `animation-delay` offsets
so left and right don't move in sync — keeps it feeling organic.

### Path Shape

Paths use the SVG viewBox coordinate system: `0 0 1000 [page height]`.
- X: 0 = left edge, 1000 = right edge
- Left paths extend 0–~180px inward from left (0–18% of 1000)
- Right paths mirror from 1000 inward

To add a new swirl, add a `<path>` inside either `<g>` block and a new `@keyframes`
entry with `d: path(...)` keyframes. Stagger the animation phase with `animation-delay`.

### Grain Texture

The `<filter id="sd-grain">` uses `feTurbulence` + `feComposite operator="in"` to clip
grain noise to the gold path shapes. Adjust `baseFrequency` for coarser/finer grain:

```xml
<feTurbulence baseFrequency="0.9 0.8" .../>   <!-- current: medium-fine -->
<feTurbulence baseFrequency="0.5 0.4" .../>   <!-- coarser, more visible -->
<feTurbulence baseFrequency="1.2 1.0" .../>   <!-- very fine, subtle -->
```

### Vignette Strips

Each `SandGutter` renders two `position: absolute` vignette `<div>`s (left + right) that fade the section's own background colour into the gutter, softening the transition between the section background and the particle area. They sit above the canvas via source order (same `zIndex: 0`) and are `pointer-events: none`.

**Properties (`vignetteBase`):**

| Property | Value | Effect |
|----------|-------|--------|
| `width` | `180px` | How far the fade extends inward from each edge |
| `zIndex` | `0` | Same layer as canvas; painted above it by source order |

**Gradient formula:**

```
left vignette:  linear-gradient(to right, rgba(vc,0.95) 0%, rgba(vc,0.55) 55%, transparent 100%)
right vignette: linear-gradient(to left,  rgba(vc,0.95) 0%, rgba(vc,0.55) 55%, transparent 100%)
```

| Stop | Opacity | Role |
|------|---------|------|
| `0%` | `0.95` | Near-opaque at the very edge — clearly visible gradient origin |
| `55%` | `0.55` | Mid-fade — gradient stays visible across most of the gutter width |
| `100%` | `0` | Fully transparent at the inner edge — doesn't touch content |

**Vignette colours per seed (`VIGNETTE_COLOR` array):**

| Seed | Section | RGB | Matches |
|------|---------|-----|---------|
| 0 | Services | `235,220,195` | Warm cream tint — reads against white `#fafafa` |
| 1 | HowItWorks | `12,20,37` | `surfaceDark` #0c1425 |
| 2 | FeaturedWork | `215,200,175` | Warm taupe — reads against gray `#e5e5e5` |
| 3 | CTA | `0,0,0` | `bgBlack` #000000 |

To tune: raise `0.95` / `0.55` for a stronger effect, lower for subtler. Increase `width` beyond `180px` to push the fade deeper into the content area (keep it below the content container padding — `px-6 lg:px-12`).

---

### Top/Bottom Fade

In `<linearGradient id="sd-fade-top">`:
```xml
<stop offset="0%"  stopOpacity="0" />   <!-- fully hidden -->
<stop offset="6%"  stopOpacity="1" />   <!-- visible from 6% down -->
<stop offset="94%" stopOpacity="1" />   <!-- starts fading at 94% -->
<stop offset="100%" stopOpacity="0" />  <!-- fully hidden -->
```

Adjust `6%` / `94%` to control how quickly the sand appears/disappears at edges.

---

## Brand Theme Guidance

The sand aesthetic connects to the "Leonis" (lion) identity — desert, heat, golden light.

**Future styling ideas that fit this theme:**

- **Section divider lines** — a 1px horizontal gradient: `transparent → #fca311 20% → transparent` between major sections
- **Hero glow** — a radial gradient at 3–5% opacity behind the headline using `#fca311`
- **Card borders on hover** — `border-color: rgba(252, 163, 17, 0.2)` for a warm glow
- **Footer sand** — extend `<SandDecoration>` to include the Footer, or create a narrower variant just for the footer top edge
- **CTA texture** — a very faint `#fca311` radial glow at the CTA section center (3% opacity)

**Color palette for consistency:**

```
#fca311           — accent gold (full) — use on dark backgrounds
#b46e00           — dark gold — use on light/white/gray backgrounds
rgba(252,163,17,0.08)  — very subtle fill
rgba(252,163,17,0.13)  — current primary dune opacity
rgba(252,163,17,0.30)  — crest strokes
rgba(252,163,17,0.50)  — hover states / borders
```

**What to avoid:**
- Full opacity `#fca311` on large areas — reads as warning, not premium
- Mixing with red/orange — the gold should feel warm and distinguished
- Excessive grain / texture everywhere — the SVG paths provide enough visual richness

---

## Z-Index Reference

```
z-50  Navbar (position: fixed)
z-10  Hero scroll indicator (position: fixed)
z-1   Page sections (position: relative) — cover sand canvas center
z-0   SVG sand canvas (position: absolute inside wrapper)
```

The SVG canvas is `pointer-events: none` — never intercepts clicks or hovers.
Section backgrounds cover the center; sand only bleeds into the gutters.
