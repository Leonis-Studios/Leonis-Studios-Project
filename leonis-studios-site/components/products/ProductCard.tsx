// components/products/ProductCard.tsx
//
// Card for one Leonis-owned product. Used on /apps, /games and the
// home page "Products" strip. Server Component — no interactivity
// beyond a link and CSS hover.

import Link from "next/link";
import Image from "next/image";
import type { ProductCard as ProductCardData } from "@/lib/types";
import { productPath, productSections, statusLabel } from "@/lib/products";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const section = productSections[product.kind];

  return (
    <Link
      href={productPath(product)}
      className="product-tile group relative flex flex-col h-full p-10 md:p-12"
      style={{
        background: colors.bgLight,
        border: `1px solid ${colors.borderLight}`,
      }}
    >
      {/* gold rule sweeps in on hover (.product-tile in globals.css) */}
      <div
        aria-hidden="true"
        className="tile-rule absolute top-0 left-0 right-0 h-0.5"
        style={{ background: colors.accent }}
      />
      <div className="flex items-center gap-5 mb-8">
        {product.icon?.url ? (
          <Image
            src={product.icon.url}
            alt={product.icon.alt ?? `${product.name} icon`}
            width={72}
            height={72}
            className="rounded-2xl transition-transform duration-500 group-hover:scale-105"
            style={{ width: 72, height: 72, objectFit: "cover" }}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-105"
            style={{
              width: 72,
              height: 72,
              background: colors.bgDark,
              color: colors.accent,
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightDisplay,
              fontSize: "32px",
            }}
          >
            {product.name.charAt(0)}
          </div>
        )}
        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase mb-1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              color: colors.antiqueGold,
            }}
          >
            {section.singular} · {statusLabel[product.status]}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightHeading,
              fontSize: tokens.fontSizes.h3,
              color: colors.textBody,
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h3>
        </div>
      </div>

      <p
        className="mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: tokens.weightHeading,
          fontSize: tokens.fontSizes.h3Compact,
          color: colors.textSubtle,
          lineHeight: 1.25,
        }}
      >
        {product.tagline}
      </p>
      <p
        className="flex-1"
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: tokens.weightBody,
          fontSize: "15px",
          color: colors.textBody,
          lineHeight: 1.7,
        }}
      >
        {product.summary}
      </p>

      <span
        className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: tokens.weightUI,
          color: colors.textBody,
        }}
      >
        <span>View {product.name}</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">
          →
        </span>
      </span>
    </Link>
  );
}
