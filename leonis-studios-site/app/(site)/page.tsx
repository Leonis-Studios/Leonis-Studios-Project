// app/(site)/page.tsx
//
// The home page is a Server Component — it has no interactivity
// itself, it just composes the section components together.
// The data fetching happens inside each section component,
// not here. This keeps each section self-contained and
// independently cacheable.

import type { Metadata } from "next";
import Hero         from "@/components/home/Hero";
import Marquee      from "@/components/home/Marquee";
import Services     from "@/components/home/Services";
import FeaturedWork from "@/components/home/FeaturedWork";
import CTA          from "@/components/home/CTA";
import siteConfig   from "@/site.config";

export const metadata: Metadata = {
  title:       siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "web design studio",
    "Next.js development agency",
    "SEO optimization services",
    "website maintenance",
    "web design New Jersey",
    "web developer NJ",
    "high-performance websites",
    "small business web design",
  ],
  openGraph: {
    title:       `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url:         siteConfig.url,
    type:        "website",
    images:      [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function HomePage() {
  // ── JSON-LD structured data ──────────────────────────────
  const organizationSchema = {
    "@context":   "https://schema.org",
    "@type":      "Organization",
    name:         siteConfig.name,
    url:          siteConfig.url,
    logo:         `${siteConfig.url}/og-default.png`,
    description:  siteConfig.description,
    email:        siteConfig.email,
    address: {
      "@type":         "PostalAddress",
      addressLocality: "New Jersey",
      addressRegion:   "NJ",
      addressCountry:  "US",
    },
    areaServed:   "United States",
    serviceType: [
      "Web Design",
      "Web Development",
      "SEO Optimization",
      "Website Maintenance",
    ],
  };

  const websiteSchema = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <Marquee />
      <Services />
      <FeaturedWork />
      <CTA />
    </>
  );
}