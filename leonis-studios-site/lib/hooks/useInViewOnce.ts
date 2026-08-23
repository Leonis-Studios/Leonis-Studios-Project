"use client";
// Single-fire scroll trigger — disconnects after the first intersection.
// Extracted from the duplicated IntersectionObserver setup in
// BenefitsClient.tsx and HowItWorksClient.tsx.

import { useEffect, useRef, useState, type RefObject } from "react";

export function useInViewOnce<T extends Element>(
  threshold = 0.15
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
