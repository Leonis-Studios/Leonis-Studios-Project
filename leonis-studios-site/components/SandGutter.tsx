"use client";

// components/SandGutter.tsx
//
// Per-section sand gutter decoration. Renders tiny drifting gold particle dots
// in the left and right gutters of a section — never touches the content area.
// Each seed (0–3) has distinct grain density/speed/behavior so sections feel
// individually characterised while using the same component.
//
// Usage (first child inside a section with position:relative overflow:hidden):
//   <section style={{ position: "relative", zIndex: 1, overflow: "hidden" }}>
//     <SandGutter seed={0} />
//     ...content...
//   </section>

import { useRef, useEffect } from "react";

interface Props {
  seed?: 0 | 1 | 2 | 3;
}

interface Grain {
  x:       number; // mean x CSS px — does NOT mutate; sway is additive offset
  y:       number; // current y CSS px — advances each frame
  r:       number; // radius [0.5, 1.5] CSS px
  alpha:   number; // base opacity (size-adjusted)
  vy:      number; // vertical velocity px/frame (+down, -up)
  phase:   number; // sway sine phase offset (radians)
  freq:    number; // sway frequency (radians/frame)
  swayAmp: number; // sway amplitude (CSS px)
}

// Seed config: each seed gives its section a distinct grain character
// alphaMult boosts visibility on light backgrounds (seeds 0,2); color picks
// dark gold on light bg so particles read clearly against white/gray.
const SEED_CFG = [
  { count: 110, vyMult: 1.00, swayAmp: 0.15, bimodal: false, alphaMult: 2.8, color: "180,110,0"  }, // 0 Services — white bg
  { count:  85, vyMult: 0.55, swayAmp: 0.22, bimodal: false, alphaMult: 1.0, color: "252,163,17" }, // 1 HowItWorks — dark bg
  { count: 140, vyMult: 1.35, swayAmp: 0.15, bimodal: false, alphaMult: 2.2, color: "180,110,0"  }, // 2 FeaturedWork — gray bg
  { count:  95, vyMult: 1.00, swayAmp: 0.15, bimodal: true,  alphaMult: 1.0, color: "252,163,17" }, // 3 CTA — black bg
] as const;

const GUTTER = 100; // CSS px — how far inward grains can spawn from each edge
const TWO_PI = Math.PI * 2;

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function edgeFade(y: number, h: number): number {
  const zone = h * 0.05;
  if (y < zone) return y / zone;
  if (y > h - zone) return (h - y) / zone;
  return 1;
}

function mobileMult(w: number): number {
  if (w <= 400) return 0;
  if (w <= 640) return 0.4;
  return 1;
}

function makeGrains(seed: 0 | 1 | 2 | 3, w: number, h: number): { left: Grain[]; right: Grain[] } {
  const cfg = SEED_CFG[seed];
  const left: Grain[]  = [];
  const right: Grain[] = [];

  for (let i = 0; i < cfg.count; i++) {
    for (const side of ["L", "R"] as const) {
      const xBase = side === "L"
        ? rnd(2, GUTTER)
        : rnd(w - GUTTER, w - 2);

      const r         = rnd(0.5, 1.5);
      const baseAlpha = rnd(0.12, 0.32);
      const alpha     = baseAlpha * (0.6 + 0.4 * (r / 1.5)) * cfg.alphaMult;

      let vy = rnd(0.08, 0.22) * cfg.vyMult;
      if (cfg.bimodal) vy *= Math.random() < 0.4 ? 1.6 : 0.4;
      if (Math.random() < 0.2) vy = -vy * 0.5; // 20% drift upward

      const grain: Grain = {
        x:       xBase,
        y:       rnd(0, h),
        r,
        alpha,
        vy,
        phase:   rnd(0, TWO_PI),
        freq:    rnd(0.003, 0.007),
        swayAmp: cfg.swayAmp,
      };

      if (side === "L") left.push(grain);
      else              right.push(grain);
    }
  }

  return { left, right };
}

export default function SandGutter({ seed = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Non-null aliases — safe because we already guarded above
    const cvs = canvas;
    const c   = ctx;

    let rafId = 0;
    let t = 0;
    let grains: { left: Grain[]; right: Grain[] } | null = null;
    let dims = { w: 0, h: 0 };

    function setup(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;

      // Reset transform before rescaling — prevents DPR accumulation on resize
      c.setTransform(1, 0, 0, 1, 0, 0);
      cvs.width  = Math.round(w * dpr);
      cvs.height = Math.round(h * dpr);
      cvs.style.width  = `${w}px`;
      cvs.style.height = `${h}px`;
      c.scale(dpr, dpr);

      if (!grains) {
        // First setup — create grains
        grains = makeGrains(seed, w, h);
      } else {
        // Resize — scale y proportionally; regenerate x for right-side grains if width changed
        const oldH = dims.h;
        const oldW = dims.w;
        if (oldH > 0) {
          const ratio = h / oldH;
          for (const g of grains.left)  g.y = g.y * ratio;
          for (const g of grains.right) g.y = g.y * ratio;
        }
        if (Math.abs(w - oldW) > 4) {
          for (const g of grains.right) g.x = rnd(w - GUTTER, w - 2);
        }
      }

      dims = { w, h };
    }

    function draw() {
      if (dims.w === 0 || dims.h === 0 || !grains) return;
      c.clearRect(0, 0, dims.w, dims.h);

      const mob = mobileMult(dims.w);
      if (mob === 0) return;

      const allGrains = [...grains.left, ...grains.right];

      for (const g of allGrains) {
        const fade  = edgeFade(g.y, dims.h);
        const alpha = g.alpha * fade * mob;
        if (alpha < 0.005) {
          // Still advance position even when invisible
          g.y += g.vy;
          if (g.y > dims.h + 10) g.y = -5;
          if (g.y < -10)         g.y = dims.h + 5;
          continue;
        }

        const displayX = g.x + Math.sin(g.phase + t * g.freq) * g.swayAmp;

        c.beginPath();
        c.arc(displayX, g.y, g.r, 0, TWO_PI);
        c.fillStyle = `rgba(${SEED_CFG[seed].color},${alpha.toFixed(3)})`;
        c.fill();

        g.y += g.vy;
        if (g.y > dims.h + 10) g.y = -5;
        if (g.y < -10)         g.y = dims.h + 5;
      }

      t++;
    }

    function loop() {
      draw();
      rafId = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w === dims.w && h === dims.h) return;
      setup(w, h);
      if (prefersReduced) draw();
    });

    ro.observe(parent);

    // Initial setup using current parent dimensions
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      setup(Math.round(rect.width), Math.round(rect.height));
    }

    if (prefersReduced) {
      draw(); // single static frame — dots visible but motionless
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        pointerEvents: "none",
        zIndex:        0,
        display:       "block",
      }}
    />
  );
}
