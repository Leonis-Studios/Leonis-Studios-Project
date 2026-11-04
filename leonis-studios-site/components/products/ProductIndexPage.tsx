// components/products/ProductIndexPage.tsx
//
// Shared body + metadata for /apps and /games. The route files are
// thin wrappers that pass a `kind`. An empty section renders a short
// "first release coming" state marked noindex, so the nav link never
// 404s and Google never indexes an empty list.

import type { Metadata } from "next";
import type { CollectionPage, WithContext } from "schema-dts";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_KIND_QUERY } from "@/sanity/lib/queries";
import type { ProductCard as ProductCardData, ProductKind } from "@/lib/types";
import { productPath, productSections } from "@/lib/products";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/products/ProductCard";
import SandGutter from "@/components/SandGutter";
import Reveal from "@/components/products/Reveal";
import { DuneRidge, HeroRise } from "@/components/products/ProductArt";
import siteConfig from "@/site.config";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

async function getProducts(kind: ProductKind): Promise<ProductCardData[]> {
  return client
    .fetch(PRODUCTS_BY_KIND_QUERY, { kind }, { next: { revalidate: 3600 } })
    .catch(() => []);
}

export async function productIndexMetadata(
  kind: ProductKind,
): Promise<Metadata> {
  const s = productSections[kind];
  const empty = (await getProducts(kind)).length === 0;
  const title = `${s.indexTitle} by ${siteConfig.name}`;
  const url = `${siteConfig.url}${s.basePath}`;
  return {
    title: { absolute: title },
    description: s.indexIntro,
    openGraph: { title, description: s.indexIntro, url, type: "website" },
    twitter: { card: "summary_large_image", title, description: s.indexIntro },
    alternates: { canonical: url },
    // Spread, not `robots: undefined` — see app/(site)/page.tsx.
    ...(empty ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ProductIndexPage({
  kind,
}: {
  kind: ProductKind;
}) {
  const s = productSections[kind];
  const products = await getProducts(kind);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${s.indexTitle} — ${siteConfig.name}`,
    description: s.indexIntro,
    url: `${siteConfig.url}${s.basePath}`,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    hasPart: products.map((p) => ({
      "@type": "SoftwareApplication",
      name: p.name,
      description: p.summary,
      url: `${siteConfig.url}${productPath(p)}`,
    })),
  } as unknown as WithContext<CollectionPage>;

  return (
    <>
      {products.length > 0 && <JsonLd data={jsonLd} />}

      <section
        className="relative overflow-hidden pt-40 pb-40 md:pb-48"
        style={{ background: colors.bgDark }}
      >
        <div
          className="relative max-w-7xl mx-auto px-6 lg:px-12"
          style={{ zIndex: 1 }}
        >
          <HeroRise delay={0} className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px" style={{ background: colors.accent }} />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightUI,
                color: colors.accent,
              }}
            >
              Made by {siteConfig.name}
            </span>
          </HeroRise>
          <HeroRise delay={150}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 9.5vw, 118px)",
                fontWeight: tokens.weightDisplay,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: colors.bgLight,
              }}
            >
              {s.indexTitle}
              <span style={{ color: colors.accent }}>.</span>
            </h1>
          </HeroRise>
          <HeroRise delay={300}>
            <p
              className="mt-8"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: tokens.fontSizes.bodyLarge,
                fontWeight: tokens.weightBody,
                color: colors.textSecondary,
                maxWidth: "560px",
                lineHeight: 1.75,
              }}
            >
              {s.indexIntro}
            </p>
          </HeroRise>
        </div>
        <DuneRidge />
      </section>

      <section
        className="py-24 md:py-28"
        style={{
          background: colors.bgMuted,
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <SandGutter seed={2} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <Reveal key={p._id} delay={(i % 3) * 120} className="h-full">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p
              className="text-center"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightHeading,
                fontSize: tokens.fontSizes.h3,
                color: colors.textBody,
              }}
            >
              Our first {s.singular.toLowerCase()} is on the way.
            </p>
          )}

          {/* Hub link back to client work — every product page is also proof for the studio. */}
          <p
            className="mt-16 text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: tokens.weightBody,
              fontSize: tokens.fontSizes.body,
              color: colors.textBody,
            }}
          >
            The same studio builds websites for businesses.{" "}
            <Link
              href="/contact"
              style={{ color: colors.antiqueGold, textDecoration: "underline" }}
            >
              Get a free quote
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
