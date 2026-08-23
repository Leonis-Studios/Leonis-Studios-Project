"use client";
// One-shot canvas grain-sweep, generalized from the sand-curtain pattern in
// BenefitsClient.tsx and the smaller sweep in Skills.tsx's TagPanel. Owns
// DPR-aware canvas sizing, grain generation, the RAF loop, and auto-unmount
// (via `showCanvas`) once the last grain finishes. Consumer supplies the
// container to size against and renders `{showCanvas && <canvas ref={canvasRef} .../>}`
// — same call shape as the two hand-rolled originals.
//
// Existing BenefitsClient/Skills canvases are left as-is (not migrated onto
// this hook) — this exists so new sweeps don't hand-roll a 3rd/4th copy.

import { useEffect, useRef, useState, type RefObject } from "react";

interface Grain {
  x:         number;
  y:         number;
  r:         number;
  baseAlpha: number;
  delay:     number;
  duration:  number;
  dir:       number; // -1 | 1 — drift direction / swirl handedness
  travel:    number; // px of horizontal drift (mode "drift") or swirl radius (mode "swirl")
}

interface Options {
  trigger:               boolean;
  containerRef:          RefObject<Element | null>;
  color:                 string; // "R,G,B"
  mode:                  "drift" | "swirl";
  density?:              number; // px^2 per grain, default 1600
  delayRange?:           [number, number];
  durationRange?:        [number, number];
  mobileDensityMult?:    number; // multiplier applied to grain count at <=640px, default 0.4; 0 below 400px
}

function mobileMult(w: number, mult: number): number {
  if (w <= 400) return 0;
  if (w <= 640) return mult;
  return 1;
}

function makeGrains(w: number, h: number, density: number, mult: number, delayRange: [number, number], durationRange: [number, number]): Grain[] {
  const count = Math.round(((w * h) / density) * mult);
  const grains: Grain[] = [];
  for (let i = 0; i < count; i++) {
    grains.push({
      x:         Math.random() * w,
      y:         Math.random() * h,
      r:         0.5 + Math.random() * 1.5,
      baseAlpha: 0.18 + Math.random() * 0.4,
      delay:     delayRange[0] + Math.random() * (delayRange[1] - delayRange[0]),
      duration:  durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]),
      dir:       Math.random() < 0.5 ? -1 : 1,
      travel:    18 + Math.random() * 26,
    });
  }
  return grains;
}

export function useSandReveal({
  trigger,
  containerRef,
  color,
  mode,
  density = 1600,
  delayRange = [0, 400],
  durationRange = [400, 800],
  mobileDensityMult = 0.4,
}: Options): { canvasRef: RefObject<HTMLCanvasElement | null>; showCanvas: boolean } {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCanvas, setShowCanvas] = useState(true);

  useEffect(() => {
    if (!trigger) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setShowCanvas(false);
      return;
    }

    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const mult = mobileMult(w, mobileDensityMult);
    if (mult === 0) {
      setShowCanvas(false);
      return;
    }

    const grains = makeGrains(w, h, density, mult, delayRange, durationRange);
    if (grains.length === 0) {
      setShowCanvas(false);
      return;
    }

    const maxEnd = Math.max(...grains.map((g) => g.delay + g.duration));
    const start  = performance.now();
    let rafId = 0;

    function frame(now: number) {
      const elapsed = now - start;
      ctx!.clearRect(0, 0, w, h);

      for (const g of grains) {
        const local = elapsed - g.delay;
        if (local <= 0) continue;

        const t     = Math.min(local / g.duration, 1);
        const alpha = g.baseAlpha * (1 - t);
        if (alpha <= 0.004) continue;

        let x = g.x;
        let y = g.y;
        if (mode === "drift") {
          x = g.x + g.dir * g.travel * t;
          y = g.y + Math.sin(t * Math.PI) * 3;
        } else {
          const angle = t * Math.PI * 1.5 * g.dir;
          x = g.x + Math.cos(angle) * g.travel * t;
          y = g.y + Math.sin(angle) * g.travel * t;
        }

        ctx!.beginPath();
        ctx!.arc(x, y, g.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx!.fill();
      }

      if (elapsed < maxEnd + 100) {
        rafId = requestAnimationFrame(frame);
      } else {
        setShowCanvas(false);
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return { canvasRef, showCanvas };
}
