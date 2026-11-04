"use client";

// "use client" — IntersectionObserver (via useInViewOnce) to fade content
// up the first time it scrolls into view. Children stay server-rendered;
// this only toggles a class. Styles: .reveal / .is-in in globals.css.

import type { ElementType, ReactNode } from "react";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number; // ms, for staggering siblings
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>(0.12);
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
