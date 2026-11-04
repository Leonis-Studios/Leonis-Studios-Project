// components/products/ProductSections.tsx
//
// Renders the editor-built `sections` on a product page, plus the
// shared MediaItem used anywhere an image-or-video can appear.
//
// Graceful fallbacks:
//   - Feature with no media → centred text-only block (no empty column)
//   - Gallery with no items → skipped entirely
//   - Video with neither file nor YouTube link → renders nothing
//
// Server Component; VideoClip and Reveal are the client islands.

import Image from "next/image";
import type {
  ProductFeatureSection,
  ProductGallerySection,
  ProductMedia,
  ProductSection,
  SectionTone,
} from "@/lib/types";
import SandGutter from "@/components/SandGutter";
import Reveal from "@/components/products/Reveal";
import VideoClip from "@/components/products/VideoClip";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

// ── Tone → palette ────────────────────────────────────────────
type Palette = {
  bg: string;
  heading: string;
  body: string;
  eyebrow: string;
  seed: 0 | 1 | 2;
  dark: boolean;
};

const palettes: Record<Exclude<SectionTone, "auto">, Palette> = {
  light: {
    bg: colors.bgCard,
    heading: colors.textBody,
    body: colors.textSubtle,
    eyebrow: colors.antiqueGold,
    seed: 0,
    dark: false,
  },
  muted: {
    bg: colors.bgMuted,
    heading: colors.textBody,
    body: colors.textSubtle,
    eyebrow: colors.antiqueGold,
    seed: 2,
    dark: false,
  },
  dark: {
    bg: colors.surfaceDark,
    heading: colors.textPrimary,
    body: colors.textSecondaryLight,
    eyebrow: colors.accent,
    seed: 1,
    dark: true,
  },
};

// "auto" alternates light/dark. The pillars block above is dark, so
// the first auto section starts light.
function paletteFor(tone: SectionTone, index: number): Palette {
  if (tone !== "auto") return palettes[tone];
  return index % 2 === 0 ? palettes.light : palettes.dark;
}

function hasMedia(m?: ProductMedia | null): m is ProductMedia {
  if (!m) return false;
  return m._type === "productImage"
    ? Boolean(m.url)
    : Boolean(m.url || m.youtubeUrl);
}

// ── MediaItem ─────────────────────────────────────────────────
// Portrait video → phone bezel. Landscape/square video → rounded frame.
// Images keep their own aspect ratio.

export function MediaItem({
  media,
  sizes,
  onDark,
}: {
  media: ProductMedia;
  sizes: string;
  onDark: boolean;
}) {
  const captionColor = onDark ? colors.textSecondaryLight : colors.textBody;

  let frame: React.ReactNode;
  if (media._type === "productImage") {
    frame = (
      <Image
        src={media.url}
        alt={media.alt}
        width={media.width ?? 1600}
        height={media.height ?? 1000}
        sizes={sizes}
        placeholder={media.lqip ? "blur" : "empty"}
        blurDataURL={media.lqip}
        className="w-full h-auto"
        style={{ borderRadius: 18 }}
      />
    );
  } else if (media.orientation === "portrait" || !media.orientation) {
    frame = (
      <div
        className="mx-auto p-1.5"
        style={{
          width: "min(300px, 72vw)",
          aspectRatio: "9 / 19.5",
          borderRadius: 40,
          background: colors.bgBlack,
          border: `1px solid ${colors.borderDark}`,
        }}
      >
        <div
          className="w-full h-full overflow-hidden"
          style={{ borderRadius: 34, background: colors.bgDark }}
        >
          <VideoClip video={media} />
        </div>
      </div>
    );
  } else {
    frame = (
      <div
        className="w-full overflow-hidden"
        style={{
          aspectRatio: media.orientation === "square" ? "1 / 1" : "16 / 9",
          borderRadius: 18,
          background: colors.bgBlack,
        }}
      >
        <VideoClip video={media} />
      </div>
    );
  }

  return (
    <figure>
      {frame}
      {media.caption && (
        <figcaption
          className="mt-4 text-sm"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: tokens.weightHeading,
            color: captionColor,
            lineHeight: 1.4,
          }}
        >
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── Shared heading block ──────────────────────────────────────

function SectionHead({
  eyebrow,
  heading,
  p,
  center = false,
}: {
  eyebrow?: string;
  heading?: string;
  p: Palette;
  center?: boolean;
}) {
  return (
    <>
      {eyebrow && (
        <div
          className={`flex items-center gap-4 mb-5 ${center ? "justify-center" : ""}`}
        >
          <div className="w-8 h-px" style={{ background: p.eyebrow }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: p.eyebrow,
            }}
          >
            {eyebrow}
          </span>
          {center && (
            <div className="w-8 h-px" style={{ background: p.eyebrow }} />
          )}
        </div>
      )}
      {heading && (
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 5.5vw, 70px)",
            fontWeight: tokens.weightDisplay,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            color: p.heading,
          }}
        >
          {heading}
        </h2>
      )}
    </>
  );
}

// ── Feature ───────────────────────────────────────────────────

function Feature({ s, p }: { s: ProductFeatureSection; p: Palette }) {
  const media = hasMedia(s.media) ? s.media : null;

  const copy = (
    <>
      <SectionHead
        eyebrow={s.eyebrow}
        heading={s.heading}
        p={p}
        center={!media}
      />
      {s.body && (
        <p
          className={`mt-6 ${media ? "" : "mx-auto"}`}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: tokens.weightBody,
            fontSize: tokens.fontSizes.body,
            color: p.body,
            lineHeight: 1.75,
            maxWidth: 560,
          }}
        >
          {s.body}
        </p>
      )}
      {s.bullets && s.bullets.length > 0 && (
        <ul
          className={`mt-8 flex flex-col gap-3 ${media ? "" : "mx-auto text-left"}`}
          style={{ maxWidth: 560 }}
        >
          {s.bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightHeading,
                fontSize: "16px",
                color: p.heading,
                lineHeight: 1.5,
              }}
            >
              <span
                aria-hidden="true"
                className="mt-[0.6em] shrink-0"
                style={{ width: 14, height: 2, background: p.eyebrow }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );

  if (!media) {
    return <Reveal className="text-center max-w-4xl mx-auto">{copy}</Reveal>;
  }

  const mediaFirst = s.mediaSide === "left";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
      <Reveal className={mediaFirst ? "lg:order-2" : ""}>{copy}</Reveal>
      <Reveal delay={140} className={mediaFirst ? "lg:order-1" : ""}>
        <MediaItem
          media={media}
          sizes="(min-width: 1024px) 45vw, 92vw"
          onDark={p.dark}
        />
      </Reveal>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────

function Gallery({ s, p }: { s: ProductGallerySection; p: Palette }) {
  const items = (s.items ?? []).filter(hasMedia);
  const rail = s.layout === "rail";

  return (
    <>
      {(s.eyebrow || s.heading || s.intro) && (
        <Reveal className="mb-14">
          <SectionHead eyebrow={s.eyebrow} heading={s.heading} p={p} />
          {s.intro && (
            <p
              className="mt-6"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: tokens.weightBody,
                fontSize: tokens.fontSizes.body,
                color: p.body,
                lineHeight: 1.75,
                maxWidth: 620,
              }}
            >
              {s.intro}
            </p>
          )}
        </Reveal>
      )}
      {rail ? (
        <ul className="shot-rail flex gap-6 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory items-start">
          {items.map((m, i) => (
            <Reveal
              as="li"
              key={m._key}
              delay={i * 90}
              className="shrink-0 snap-start"
              style={{
                width:
                  m._type === "productVideo" && m.orientation !== "portrait"
                    ? "min(520px, 85vw)"
                    : "min(300px, 72vw)",
              }}
            >
              <MediaItem media={m} sizes="300px" onDark={p.dark} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <ul
          className={`grid grid-cols-1 sm:grid-cols-2 ${items.length >= 3 ? "lg:grid-cols-3" : ""} gap-8 items-start`}
        >
          {items.map((m, i) => (
            <Reveal as="li" key={m._key} delay={(i % 3) * 110}>
              <MediaItem
                media={m}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                onDark={p.dark}
              />
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}

// ── Sections list ─────────────────────────────────────────────

export default function ProductSections({
  sections,
}: {
  sections?: ProductSection[] | null;
}) {
  // Drop galleries with nothing to show before assigning auto tones,
  // so the light/dark alternation stays even.
  const visible = (sections ?? []).filter((s) =>
    s._type === "productFeature"
      ? Boolean(s.heading)
      : (s.items ?? []).some(hasMedia),
  );
  if (!visible.length) return null;

  return (
    <>
      {visible.map((s, i) => {
        const p = paletteFor(s.tone, i);
        return (
          <section
            key={s._key}
            className="py-24 md:py-28"
            style={{
              background: p.bg,
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            <SandGutter seed={p.seed} />
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              {s._type === "productFeature" ? (
                <Feature s={s} p={p} />
              ) : (
                <Gallery s={s} p={p} />
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
