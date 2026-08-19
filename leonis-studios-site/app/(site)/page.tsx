// app/(site)/page.tsx
//
// The home page is a Server Component — it has no interactivity
// itself, it just composes the section components together.
// The data fetching happens inside each section component,
// not here. This keeps each section self-contained and
// independently cacheable.

import type { Metadata } from "next";
import type { Organization, WebSite, WithContext } from "schema-dts";
import { client }        from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import type { HomePageData } from "@/lib/types";
import Hero             from "@/components/home/Hero";
import Marquee          from "@/components/home/Marquee";
import Services         from "@/components/home/Services";
import HowItWorks       from "@/components/home/HowItWorks";
import FeaturedWork     from "@/components/home/FeaturedWork";
import FAQ              from "@/components/home/FAQ";
import CTA              from "@/components/home/CTA";
import JsonLd           from "@/components/JsonLd";
import siteConfig       from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  const homePage: HomePageData | null = await client
    .fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const title       = homePage?.seo?.metaTitle       ?? siteConfig.name;
  const description = homePage?.seo?.metaDescription ?? siteConfig.description;
  const ogImage      = homePage?.seo?.ogImage;

  return {
    // Absolute — bypasses the root layout's "%s — {name}" template,
    // since the home page title already is the site name.
    title: { absolute: title },
    description,
    keywords: [
      "web design studio",
      "Next.js development agency",
      "SEO optimization services",
      "website maintenance",
      "web design New York",
      "web developer New York",
      "high-performance websites",
      "small business web design",
    ],
    openGraph: {
      title:       `${siteConfig.name} — ${siteConfig.tagline}`,
      description,
      url:         siteConfig.url,
      type:        "website",
      images:      ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${siteConfig.name} — ${siteConfig.tagline}`,
      description,
    },
    alternates: {
      canonical: siteConfig.url,
    },
    robots: homePage?.seo?.noindex ? { index: false, follow: true } : undefined,
  };
}

export default function HomePage() {
  // ── JSON-LD structured data ──────────────────────────────
  // Built as untyped literals first, then assigned to schema-dts-typed
  // consts — some fields here (serviceType on Organization, the
  // "query-input" SearchAction property Google's docs specify) fall
  // outside schema-dts's strict shape but are valid, widely-supported
  // JSON-LD. The indirection keeps the data byte-for-byte identical
  // to before while still getting a WithContext<T> type on the const.
  const organizationData = {
    "@context":   "https://schema.org",
    "@type":      "Organization",
    name:         siteConfig.name,
    url:          siteConfig.url,
    logo:         `${siteConfig.url}/logo-square.png`,
    description:  siteConfig.description,
    email:        siteConfig.email,
    address: {
      "@type":         "PostalAddress",
      addressLocality: "New York",
      addressRegion:   "NY",
      addressCountry:  "US",
    },
    areaServed:   "United States",
    serviceType: [
      "Web Design",
      "Web Development",
      "SEO Optimization",
      "Website Maintenance",
    ],
  } as const;
  const organizationSchema = organizationData as WithContext<Organization>;

  const websiteData = {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    name:       siteConfig.name,
    url:        siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type":       "SearchAction",
      target:        `${siteConfig.url}/work?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  } as const;
  const websiteSchema: WithContext<WebSite> = websiteData;

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <Marquee />
      <Services />
      <HowItWorks />
      <FeaturedWork />
      <FAQ />
      <CTA />
    </>
  );
}