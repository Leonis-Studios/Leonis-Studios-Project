"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

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

  return (
    <div style={{ borderTop: `1px solid rgba(252,163,17,0.15)` }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item._key ?? item._id ?? i}
            style={{ borderBottom: `1px solid rgba(252,163,17,0.15)` }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-6 text-left"
              aria-expanded={isOpen}
            >
              <span
                style={{
                  fontFamily:   "var(--font-display)",
                  fontSize:     tokens.fontSizes.h3Compact,
                  fontWeight:   tokens.weightHeading,
                  color:        colors.textBody,
                  paddingRight: "24px",
                }}
              >
                {item.question}
              </span>
              <span
                aria-hidden
                style={{
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
