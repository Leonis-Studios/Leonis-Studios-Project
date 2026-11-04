// components/products/ProductArt.tsx
//
// Decorative pieces shared by the product pages. Server Components —
// all motion is CSS (see the Products block in globals.css).
//
//   DuneRidge   — layered dune silhouettes on the hero floor, with a
//                 gold crest line that draws itself on load
//   DeviceFrame — phone bezel that floats gently; plays a screen
//                 recording, else shows a screenshot, else the product
//                 icon on a dark screen
//   HeroRise    — wrapper that staggers hero copy in on load

import Image from "next/image";
import type { ProductVideoMedia, SanityImage } from "@/lib/types";
import VideoClip from "@/components/products/VideoClip";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

export function HeroRise({
  delay,
  children,
  className = "",
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`hero-rise ${className}`}
      style={{ ["--rise-delay" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function DuneRidge() {
  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-0 left-0 w-full pointer-events-none"
      style={{ height: "clamp(90px, 14vw, 180px)" }}
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
    >
      {/* back dune */}
      <path
        d="M0 120 C 180 70, 340 70, 520 105 S 860 150, 1040 98 S 1320 60, 1440 92 L1440 180 L0 180 Z"
        fill={colors.surfaceDark}
        opacity={0.55}
      />
      {/* front dune */}
      <path
        d="M0 150 C 220 118, 420 112, 640 138 S 1020 172, 1220 136 S 1380 120, 1440 130 L1440 180 L0 180 Z"
        fill={colors.surfaceDark}
      />
      {/* crest line, drawn on load */}
      <path
        className="dune-line"
        d="M0 120 C 180 70, 340 70, 520 105 S 860 150, 1040 98 S 1320 60, 1440 92"
        fill="none"
        stroke={colors.accent}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        style={{ ["--dune-length" as string]: 1700 }}
      />
    </svg>
  );
}

export function DeviceFrame({
  video,
  screen,
  icon,
  name,
  priority = false,
}: {
  video?: ProductVideoMedia | null;
  screen?: Pick<SanityImage, "url" | "alt" | "width" | "height">;
  icon?: Partial<SanityImage>;
  name: string;
  priority?: boolean;
}) {
  return (
    <div className="relative mx-auto" style={{ width: "min(300px, 72vw)" }}>
      {/* breathing gold glow behind the phone */}
      <div
        aria-hidden="true"
        className="device-glow absolute -inset-16 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(closest-side, rgba(252,163,17,0.32), rgba(252,163,17,0.08) 55%, rgba(252,163,17,0) 75%)`,
        }}
      />
      <div
        className="device-float relative p-2.5"
        style={{
          aspectRatio: "9 / 19.5",
          borderRadius: "46px",
          background: colors.bgBlack,
          border: `1px solid ${colors.borderDark}`,
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)",
        }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ borderRadius: "38px", background: colors.bgDark }}
        >
          {video ? (
            <VideoClip video={{ ...video, loop: true }} />
          ) : screen?.url ? (
            <Image
              src={screen.url}
              alt={screen.alt}
              fill
              sizes="300px"
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              style={{
                background: `radial-gradient(120% 70% at 50% 0%, ${colors.surfaceAccent} 0%, ${colors.bgDark} 55%, ${colors.surfaceDark} 100%)`,
              }}
            >
              {/* concentric dune rings */}
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "78%",
                  aspectRatio: "1",
                  border: "1px solid rgba(252,163,17,0.14)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "54%",
                  aspectRatio: "1",
                  border: "1px solid rgba(252,163,17,0.22)",
                }}
              />
              {icon?.url ? (
                <Image
                  src={icon.url}
                  alt={icon.alt ?? `${name} icon`}
                  width={96}
                  height={96}
                  className="relative rounded-3xl"
                  style={{
                    width: 96,
                    height: 96,
                    boxShadow: "0 12px 40px -8px rgba(252,163,17,0.5)",
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="relative flex items-center justify-center rounded-3xl"
                  style={{
                    width: 96,
                    height: 96,
                    background: colors.accent,
                    color: colors.bgBlack,
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightDisplay,
                    fontSize: "44px",
                  }}
                >
                  {name.charAt(0)}
                </div>
              )}
              <span
                className="relative text-xs tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                  color: colors.textSecondary,
                }}
              >
                {name}
              </span>
            </div>
          )}
          {/* dynamic-island notch */}
          <div
            aria-hidden="true"
            className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: "32%", height: 22, background: colors.bgBlack }}
          />
        </div>
      </div>
    </div>
  );
}
