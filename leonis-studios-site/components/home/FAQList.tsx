"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";
import { useInViewOnce } from "@/lib/hooks/useInViewOnce";

// Accepts both global faqItem documents (_id) and content-local
// faq[] block items (_key) — either identifier works as a React key.
interface FAQListItem {
  _id?:      string;
  _key?:     string;
  question:  string;
  answer:    string;
}

export default function FAQList({ items }: { items: FAQListItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.1);

  return (
    <div ref={ref} style={{ borderTop: `1px solid rgba(252,163,17,0.15)` }}>
      <style>{`
        @keyframes faqRowIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes faqGlint {
          from { transform: translateX(-120%) skewX(-14deg); opacity: 0; }
          20%  { opacity: 0.8; }
          to   { transform: translateX(220%) skewX(-14deg); opacity: 0; }
        }
      `}</style>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item._key ?? item._id ?? i}
            style={{
              borderBottom: `1px solid rgba(252,163,17,0.15)`,
              opacity: inView ? undefined : 0,
              animation: inView ? `faqRowIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both` : undefined,
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-4 py-6 text-left"
              aria-expanded={isOpen}
            >
              {/* Gypsum facet mark — glints when the answer opens */}
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: "9px",
                  height: "9px",
                  background: colors.accent,
                  clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
                  overflow: "hidden",
                }}
              >
                {isOpen && (
                  <span
                    key={`glint-${i}-${isOpen}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.9) 50%, transparent)",
                      animation: "faqGlint 0.7s ease 1",
                    }}
                  />
                )}
              </span>
              <span
                style={{
                  fontFamily:   "var(--font-display)",
                  fontSize:     tokens.fontSizes.h3Compact,
                  fontWeight:   tokens.weightHeading,
                  color:        colors.textBody,
                  paddingRight: "24px",
                  flex: 1,
                }}
              >
                {item.question}
              </span>
              <span
                aria-hidden
                style={{
                  position: "relative",
                  color:      colors.accent,
                  fontSize:   "24px",
                  lineHeight: 1,
                  flexShrink: 0,
                  fontWeight: tokens.weightDisplay,
                  transition: "transform 0.3s ease",
                  transform:  isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  display:    "block",
                }}
              >
                {isOpen && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: "-10px",
                      zIndex: -1,
                      borderRadius: "999px",
                      background: "radial-gradient(circle, rgba(252,163,17,0.25) 0%, transparent 70%)",
                    }}
                  />
                )}
                +
              </span>
            </button>

            {/* Grid-rows expand — no max-height hacks, works for any content length */}
            <div
              style={{
                display:         "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition:      "grid-template-rows 0.35s ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p
                  className="pb-7"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize:   tokens.fontSizes.body,
                    fontWeight: tokens.weightBody,
                    color:      colors.textSubtle,
                    lineHeight: 1.75,
                    maxWidth:   "780px",
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
