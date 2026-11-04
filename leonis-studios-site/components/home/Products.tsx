// components/home/Products.tsx
//
// Home page strip for Leonis-owned apps and games. Sits after
// FeaturedWork so the page stays client-focused: it reads as proof
// ("we ship our own products"), not as a second storefront.
// Renders nothing until a product is marked featured in Sanity.

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { FEATURED_PRODUCTS_QUERY } from "@/sanity/lib/queries";
import type { ProductCard as ProductCardData } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import SandGutter from "@/components/SandGutter";
import Reveal from "@/components/products/Reveal";
import { productSections } from "@/lib/products";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

export default async function Products() {
  const products: ProductCardData[] = await client
    .fetch(FEATURED_PRODUCTS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  if (!products.length) return null;

  const anyLive = products.some((p) => p.status === "live");
  // Link to whichever section has products; apps first.
  const indexHref = products.some((p) => p.kind === "app")
    ? productSections.app.basePath
    : productSections.game.basePath;

  return (
    <section
      className="py-24"
      style={{
        background: colors.bgCard,
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      <SandGutter seed={0} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-8 h-px"
                style={{ background: colors.antiqueGold }}
              />
              <span
                className="text-xs tracking-[0.25em] uppercase"
                style={{
                  color: colors.antiqueGold,
                  fontFamily: "var(--font-display)",
                  fontWeight: tokens.weightUI,
                }}
              >
                {anyLive ? "Products we've shipped" : "Products we're building"}
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5.5vw, 70px)",
                fontWeight: tokens.weightDisplay,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: colors.textBody,
              }}
            >
              We build our own, too.
            </h2>
            <p
              className="mt-6"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: tokens.weightBody,
                fontSize: tokens.fontSizes.body,
                color: colors.textSubtle,
                maxWidth: "560px",
                lineHeight: 1.7,
              }}
            >
              Apps and games we design, build, and run ourselves, from idea to
              the App Store.
            </p>
          </div>
          <Link
            href={indexHref}
            className="text-neutral-600 hover:text-black text-xs tracking-[0.15em] uppercase transition-colors duration-200 flex items-center gap-2 group self-end"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
            }}
          >
            <span>See all products</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((p, i) => (
            <Reveal key={p._id} delay={i * 120} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
