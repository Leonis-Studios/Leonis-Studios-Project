// components/products/ProductDetailPage.tsx
//
// Shared product page for /apps/[slug] and /games/[slug].
//
// Anatomy (top to bottom):
//   1. Hero — product's own name and icon, "by Leonis Studios" endorsement,
//      tagline, a status-driven CTA (waitlist → pre-order → download), and
//      a floating device over a dune ridge that draws itself on load
//   2. Pillars — what it does better (scroll-revealed, staggered)
//   2b. Sections — editor-built feature blocks + image/video galleries
//      (components/products/ProductSections.tsx); text-only when no media
//   3. Screenshots — same order as the store listing, in device frames
//   4. Long description (Portable Text)
//   5. FAQ — FAQPage JSON-LD
//   6. Support & privacy (#support) — this URL works as the store
//      listing's Support URL; privacy links to /privacy#<anchor>
//   7. Studio cross-link — product visitors who run a business
//      find the client-work side
//
// ProductDetailPage fetches; ProductDetailView renders from props.
// Client islands: WaitlistForm and Reveal. Everything else is CSS motion.

import type { Metadata } from "next";
import type {
  BreadcrumbList,
  FAQPage,
  SoftwareApplication,
  WithContext,
} from "schema-dts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import {
  PRODUCT_BY_SLUG_QUERY,
  PRODUCT_SLUGS_BY_KIND_QUERY,
} from "@/sanity/lib/queries";
import type { Product, ProductKind } from "@/lib/types";
import { productPath, productSections, statusLabel } from "@/lib/products";
import JsonLd from "@/components/JsonLd";
import ContentFAQ from "@/components/shared/ContentFAQ";
import SandGutter from "@/components/SandGutter";
import WaitlistForm from "@/components/products/WaitlistForm";
import Reveal from "@/components/products/Reveal";
import {
  DeviceFrame,
  DuneRidge,
  HeroRise,
} from "@/components/products/ProductArt";
import ProductSections from "@/components/products/ProductSections";
import siteConfig from "@/site.config";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

async function getProduct(
  kind: ProductKind,
  slug: string,
): Promise<Product | null> {
  return client
    .fetch(
      PRODUCT_BY_SLUG_QUERY,
      { kind, slug },
      { next: { revalidate: 3600 } },
    )
    .catch(() => null);
}

export async function productStaticParams(kind: ProductKind) {
  const slugs: { slug: string }[] = await client
    .fetch(PRODUCT_SLUGS_BY_KIND_QUERY, { kind })
    .catch(() => []);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function productMetadata(
  kind: ProductKind,
  slug: string,
): Promise<Metadata> {
  const product = await getProduct(kind, slug);
  if (!product) return { title: "Not Found" };

  const url = `${siteConfig.url}${productPath(product)}`;
  return {
    title: { absolute: product.seoTitle },
    description: product.seoDescription,
    keywords: [
      product.name,
      product.primaryKeyword,
      `${product.name} ${productSections[kind].singular.toLowerCase()}`,
      siteConfig.name,
    ].filter(Boolean) as string[],
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      url,
      type: "website",
      images: product.seoImage ? [{ url: product.seoImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle,
      description: product.seoDescription,
    },
    alternates: { canonical: url },
    // Spread, not `robots: undefined` — see app/(site)/page.tsx.
    ...(product.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

// ── Small presentational pieces ───────────────────────────────

const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

function Eyebrow({
  children,
  onLight = false,
}: {
  children: React.ReactNode;
  onLight?: boolean;
}) {
  const c = onLight ? colors.antiqueGold : colors.accent;
  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-8 h-px" style={{ background: c }} />
      <span
        className="text-xs tracking-[0.25em] uppercase"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: tokens.weightUI,
          color: c,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function SectionHeading({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(36px, 5.5vw, 70px)",
        fontWeight: tokens.weightDisplay,
        lineHeight: 0.95,
        letterSpacing: "-0.025em",
        color: onDark ? colors.textPrimary : colors.textBody,
        maxWidth: "820px",
      }}
    >
      {children}
    </h2>
  );
}

function StatusChip({ product }: { product: Product }) {
  const live = product.status === "live";
  return (
    <span
      className="inline-flex items-center gap-2.5 px-3.5 py-1.5 text-[11px] tracking-[0.2em] uppercase"
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: tokens.weightUI,
        color: colors.accent,
        border: `1px solid rgba(252,163,17,0.35)`,
        background: "rgba(252,163,17,0.06)",
      }}
    >
      <span
        aria-hidden="true"
        className={live ? "" : "status-dot"}
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: colors.accent,
        }}
      />
      {statusLabel[product.status]}
    </span>
  );
}

function StoreButton({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-4 text-sm tracking-widest uppercase group transition-colors duration-200"
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: tokens.weightUI,
        background: primary ? colors.accent : "transparent",
        color: primary ? colors.bgBlack : colors.accent,
        border: `1px solid ${colors.accent}`,
      }}
    >
      <span>{label}</span>
      <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
        ↗
      </span>
    </a>
  );
}

function ProductCTA({ product }: { product: Product }) {
  if (product.status === "retired") {
    return (
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: tokens.weightBody,
          color: colors.textSecondary,
        }}
      >
        {product.name} is no longer available for download.
      </p>
    );
  }

  const pre = product.status === "preorder";
  const stores =
    product.status === "development"
      ? []
      : ([
          product.appStoreUrl && {
            href: product.appStoreUrl,
            label: pre
              ? "Pre-order on the App Store"
              : "Download on the App Store",
          },
          product.playStoreUrl && {
            href: product.playStoreUrl,
            label: pre
              ? "Pre-register on Google Play"
              : "Get it on Google Play",
          },
          product.webAppUrl &&
            !pre && { href: product.webAppUrl, label: "Open in browser" },
        ].filter(Boolean) as { href: string; label: string }[]);

  // Waitlist stays up through pre-order: store pre-orders don't hand
  // over contact details, the studio's own list does.
  const showWaitlist = product.hasWaitlist && product.status !== "live";

  return (
    <div className="flex flex-col gap-6">
      {stores.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {stores.map((s, i) => (
            <StoreButton key={s.href} {...s} primary={i === 0} />
          ))}
        </div>
      )}
      {showWaitlist && (
        <WaitlistForm
          product={product.slug}
          productName={product.name}
          pitch={product.waitlistPitch}
        />
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default async function ProductDetailPage({
  kind,
  slug,
}: {
  kind: ProductKind;
  slug: string;
}) {
  const product = await getProduct(kind, slug);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}

export function ProductDetailView({ product }: { product: Product }) {
  const kind = product.kind;
  const section = productSections[kind];
  const url = `${siteConfig.url}${productPath(product)}`;
  const supportEmail = product.supportEmail ?? siteConfig.email;
  const isMobile = product.platforms?.some(
    (p) => p === "iOS" || p === "Android",
  );

  // ── JSON-LD ────────────────────────────────────────────────
  const appSchema = {
    "@context": "https://schema.org",
    "@type":
      kind === "game"
        ? "VideoGame"
        : isMobile
          ? "MobileApplication"
          : "SoftwareApplication",
    name: product.name,
    description: product.summary,
    url,
    applicationCategory:
      product.category ?? (kind === "game" ? "GameApplication" : undefined),
    operatingSystem: product.platforms?.join(", "),
    image: product.icon?.url,
    screenshot: product.screenshots?.map((s) => s.url),
    publisher: { "@id": `${siteConfig.url}/#organization` },
    author: { "@id": `${siteConfig.url}/#organization` },
    ...(product.isFree &&
    product.status !== "development" &&
    product.status !== "retired"
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
      : {}),
    ...(product.launchDate ? { datePublished: product.launchDate } : {}),
    sameAs: [product.appStoreUrl, product.playStoreUrl].filter(Boolean),
  } as unknown as WithContext<SoftwareApplication>;

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: section.label,
        item: `${siteConfig.url}${section.basePath}`,
      },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };

  const faqSchema: WithContext<FAQPage> | null = product.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: product.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const launch = product.launchDate
    ? new Date(`${product.launchDate}T00:00:00`).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const meta = [
    product.platforms?.join(" · "),
    product.priceLabel,
    launch && product.status !== "live" ? `Launching ${launch}` : null,
  ].filter(Boolean) as string[];

  // Hero visual: dedicated art if provided, otherwise the first
  // screenshot in a device frame, otherwise the icon in a frame.
  const heroShot = product.screenshots?.[0];

  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-36 pb-40 md:pb-48"
        style={{ background: colors.bgDark }}
      >
        {/* faint vertical gold rule, echoing the /work hero */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 right-[38%] w-px hidden lg:block"
          style={{ background: colors.accent, opacity: 0.08 }}
        />

        <div
          className="relative max-w-7xl mx-auto px-6 lg:px-12"
          style={{ zIndex: 1 }}
        >
          <HeroRise delay={0}>
            <Link
              href={section.basePath}
              className="inline-flex items-center gap-2 mb-12 text-xs tracking-[0.15em] uppercase transition-colors duration-200 hover:text-white group"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightUI,
                color: colors.textSecondary,
              }}
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">
                ←
              </span>
              <span>All {section.label}</span>
            </Link>
          </HeroRise>

          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-10 items-center">
            <div>
              <HeroRise
                delay={100}
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                {product.icon?.url && (
                  <Image
                    src={product.icon.url}
                    alt={product.icon.alt ?? `${product.name} icon`}
                    width={64}
                    height={64}
                    priority
                    className="rounded-2xl"
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      boxShadow: "0 10px 30px -10px rgba(252,163,17,0.45)",
                    }}
                  />
                )}
                <StatusChip product={product} />
              </HeroRise>

              <HeroRise delay={220}>
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
                  {product.name}
                  <span style={{ color: colors.accent }}>.</span>
                </h1>
                {/* Endorsement line — the product keeps its own name; the studio stands behind it. */}
                <p
                  className="mt-4 text-xs tracking-[0.3em] uppercase"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightUI,
                    color: colors.textSecondary,
                  }}
                >
                  {section.singular} by{" "}
                  <span style={{ color: colors.accent }}>
                    {siteConfig.name}
                  </span>
                </p>
              </HeroRise>

              <HeroRise delay={340}>
                <p
                  className="mt-8"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightHeading,
                    fontSize: tokens.fontSizes.h3,
                    color: colors.textPrimary,
                    lineHeight: 1.2,
                    maxWidth: "560px",
                  }}
                >
                  {product.tagline}
                </p>
                <p
                  className="mt-5 mb-10"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: tokens.weightBody,
                    fontSize: tokens.fontSizes.body,
                    color: colors.textSecondaryLight,
                    lineHeight: 1.75,
                    maxWidth: "540px",
                  }}
                >
                  {product.summary}
                </p>
              </HeroRise>

              <HeroRise delay={460}>
                <ProductCTA product={product} />
                {meta.length > 0 && (
                  <p
                    className="mt-8 text-xs tracking-[0.2em] uppercase"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: tokens.weightUI,
                      color: colors.textSecondary,
                    }}
                  >
                    {meta.join("  ·  ")}
                  </p>
                )}
              </HeroRise>
            </div>

            <HeroRise delay={380} className="flex justify-center">
              {product.heroImage?.url ? (
                <div
                  className="device-float relative"
                  style={{ maxWidth: 520, width: "100%" }}
                >
                  <Image
                    src={product.heroImage.url}
                    alt={product.heroImage.alt}
                    width={product.heroImage.width ?? 1200}
                    height={product.heroImage.height ?? 1200}
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <DeviceFrame
                  video={product.heroVideo}
                  screen={heroShot}
                  icon={product.icon}
                  name={product.name}
                  priority
                />
              )}
            </HeroRise>
          </div>
        </div>

        <DuneRidge />
      </section>

      {/* ── 2. Pillars ──────────────────────────────────────── */}
      {product.pillars && product.pillars.length > 0 && (
        <section
          className="py-24 md:py-28"
          style={{
            background: colors.surfaceDark,
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <SandGutter seed={1} />
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <Reveal>
              <Eyebrow>Why {product.name}</Eyebrow>
              <SectionHeading onDark>
                Built to do a few things{" "}
                <span style={{ color: colors.accent }}>better.</span>
              </SectionHeading>
            </Reveal>

            <div
              className={`mt-16 grid grid-cols-1 md:grid-cols-2 ${product.pillars.length % 3 === 0 ? "lg:grid-cols-3" : ""} gap-px`}
              style={{ background: colors.borderDark }}
            >
              {product.pillars.map((p, i) => (
                // Cell bg stays put (keeps the hairline grid intact); only the content reveals.
                <div
                  key={p._key}
                  className="product-tile group relative h-full p-10 md:p-12"
                  style={{ background: colors.surfaceDark }}
                >
                  <div
                    aria-hidden="true"
                    className="tile-rule absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: colors.accent }}
                  />
                  <Reveal delay={i * 110}>
                    <p
                      className="mb-8"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightDisplay,
                        fontSize: "clamp(36px, 4vw, 52px)",
                        lineHeight: 1,
                        color: colors.surfaceAccent,
                        transition: `color 0.4s ${ease}`,
                      }}
                    >
                      <span className="group-hover:text-[#fca311] transition-colors duration-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </p>
                    <h3
                      className="mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightHeading,
                        fontSize: tokens.fontSizes.h3,
                        color: colors.textPrimary,
                        lineHeight: 1.15,
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: tokens.weightBody,
                        fontSize: "16px",
                        color: colors.textSecondaryLight,
                        lineHeight: 1.75,
                      }}
                    >
                      {p.description}
                    </p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 2b. Editor-built sections (features, galleries) ─── */}
      <ProductSections sections={product.sections} />

      {/* ── 3. Screenshots ──────────────────────────────────── */}
      {product.screenshots && product.screenshots.length > 0 && (
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
            <Reveal>
              <Eyebrow onLight>
                Inside the {section.singular.toLowerCase()}
              </Eyebrow>
              <SectionHeading>See it in action.</SectionHeading>
            </Reveal>
            <ul
              className="shot-rail mt-14 flex gap-6 md:gap-8 overflow-x-auto pb-6 snap-x snap-mandatory"
              aria-label={`${product.name} screenshots`}
            >
              {product.screenshots.map((s, i) => (
                <Reveal
                  as="li"
                  key={s._key}
                  delay={i * 90}
                  className="shrink-0 snap-start"
                  style={{ width: "min(240px, 66vw)" }}
                >
                  <div
                    className="product-tile p-1.5"
                    style={{
                      borderRadius: "34px",
                      background: colors.bgBlack,
                      aspectRatio: "9 / 19.5",
                    }}
                  >
                    <div
                      className="relative w-full h-full overflow-hidden"
                      style={{ borderRadius: "28px" }}
                    >
                      <Image
                        src={s.url}
                        alt={s.alt}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {s.caption && (
                    <p
                      className="mt-4 text-sm"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: tokens.weightHeading,
                        color: colors.textBody,
                        lineHeight: 1.4,
                      }}
                    >
                      {s.caption}
                    </p>
                  )}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 4. Long description ─────────────────────────────── */}
      {product.body && product.body.length > 0 && (
        <section
          style={{
            background: colors.bgLight,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
            <Reveal className="prose-leonis max-w-3xl">
              <PortableText value={product.body} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ── 5. FAQ ──────────────────────────────────────────── */}
      {product.faq && product.faq.length > 0 && (
        <ContentFAQ
          items={product.faq}
          eyebrow={`${product.name} FAQ`}
          headline="Questions, answered."
        />
      )}

      {/* ── 6. Support & privacy ────────────────────────────── */}
      <section
        id="support"
        className="py-24 scroll-mt-28"
        style={{
          background: colors.bgDark,
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <SandGutter seed={1} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{
              background: colors.borderDark,
              border: `1px solid ${colors.borderDark}`,
            }}
          >
            <div
              className="p-10 md:p-12 h-full"
              style={{ background: colors.bgDark }}
            >
              <Reveal>
                <Eyebrow>Support</Eyebrow>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightDisplay,
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: colors.textPrimary,
                  }}
                >
                  Need help with {product.name}?
                </h2>
                <p
                  className="mt-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: tokens.weightBody,
                    fontSize: tokens.fontSizes.body,
                    color: colors.textSecondaryLight,
                    lineHeight: 1.75,
                  }}
                >
                  Email{" "}
                  <a
                    href={`mailto:${supportEmail}?subject=${encodeURIComponent(`${product.name} support`)}`}
                    style={{
                      color: colors.accent,
                      textDecoration: "underline",
                      textUnderlineOffset: 4,
                    }}
                  >
                    {supportEmail}
                  </a>{" "}
                  with your device and a short description. We reply within two
                  business days.
                </p>
              </Reveal>
            </div>
            <div
              className="p-10 md:p-12 h-full"
              style={{ background: colors.bgDark }}
            >
              <Reveal delay={120}>
                <Eyebrow>Privacy</Eyebrow>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: tokens.weightDisplay,
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: colors.textPrimary,
                  }}
                >
                  Your data, plainly.
                </h2>
                <p
                  className="mt-6"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: tokens.weightBody,
                    fontSize: tokens.fontSizes.body,
                    color: colors.textSecondaryLight,
                    lineHeight: 1.75,
                  }}
                >
                  What {product.name} stores, what leaves your device, and how
                  to delete it:{" "}
                  <Link
                    href={`/privacy#${product.privacyAnchor}`}
                    style={{
                      color: colors.accent,
                      textDecoration: "underline",
                      textUnderlineOffset: 4,
                    }}
                  >
                    read the {product.name} privacy policy
                  </Link>
                  .
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Studio cross-link ────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: colors.bgBlack, position: "relative", zIndex: 1 }}
      >
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p
              className="mb-3 text-xs tracking-[0.25em] uppercase"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightUI,
                color: colors.accent,
              }}
            >
              From the studio behind {product.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: tokens.weightHeading,
                fontSize: tokens.fontSizes.h3,
                color: colors.textPrimary,
                maxWidth: "620px",
                lineHeight: 1.25,
              }}
            >
              We build websites for businesses with the same care.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-4 text-sm tracking-widest uppercase group shrink-0 transition-colors duration-200 hover:bg-[#fca311] hover:text-black"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: tokens.weightUI,
              border: `1px solid ${colors.accent}`,
              color: colors.accent,
            }}
          >
            <span>Get a Free Quote</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
