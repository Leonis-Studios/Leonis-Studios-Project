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
import Benefits         from "@/components/home/Benefits";
import Services         from "@/components/home/Services";
import HowItWorks       from "@/components/home/HowItWorks";
import FeaturedWork     from "@/components/home/FeaturedWork";
import Products         from "@/components/home/Products";
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
      "lead generation websites",
      "lead generation web design",
      "SEO web design",
      "GEO generative engine optimization",
      "AEO answer engine optimization",
      "AI search optimization",
      "web design New York",
      "small business web design",
      "custom website design",
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
    // Spread, not `robots: undefined` — an explicit undefined key
    // overrides the root layout's robots/googleBot directives.
    ...(homePage?.seo?.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function HomePage() {
  // ── JSON-LD structured data ──────────────────────────────
  // Built as untyped literals first, then cast to schema-dts types —
  // a few fields (serviceType on Organization) fall outside schema-dts's
  // strict shape but are valid, widely-supported JSON-LD.
  // The @id lets the about page's ProfessionalService node and every
  // page's publisher reference resolve to this same entity.
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  const organizationData = {
    "@context":   "https://schema.org",
    "@type":      "Organization",
    "@id":        `${siteConfig.url}/#organization`,
    name:         siteConfig.name,
    url:          siteConfig.url,
    logo:         `${siteConfig.url}/logo-square.png`,
    slogan:       siteConfig.tagline,
    description:  siteConfig.description,
    email:        siteConfig.email,
    founder: {
      "@type": "Person",
      name:    "Hassan Shirazi",
    },
    address: {
      "@type":         "PostalAddress",
      addressLocality: "New York",
      addressRegion:   "NY",
      addressCountry:  "US",
    },
    areaServed:   { "@type": "Country", name: "United States" },
    contactPoint: {
      "@type":           "ContactPoint",
      contactType:       "sales",
      email:             siteConfig.email,
      url:               `${siteConfig.url}/contact`,
      availableLanguage: "English",
    },
    serviceType: [
      "Lead Generation Web Design",
      "Web Development",
      "Search Engine Optimization (SEO)",
      "Generative Engine Optimization (GEO)",
      "Answer Engine Optimization (AEO)",
      "Local SEO",
      "Website Maintenance",
    ],
    knowsAbout: [
      "Lead generation websites",
      "Search engine optimization",
      "Generative engine optimization",
      "Answer engine optimization",
      "AI search visibility",
      "Local SEO",
      "Conversion-focused web design",
      "Next.js",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  } as const;
  const organizationSchema = organizationData as unknown as WithContext<Organization>;

  const websiteSchema: WithContext<WebSite> = {
    "@context":  "https://schema.org",
    "@type":     "WebSite",
    "@id":       `${siteConfig.url}/#website`,
    name:        siteConfig.name,
    url:         siteConfig.url,
    description: siteConfig.description,
    inLanguage:  "en-US",
    publisher:   { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Hero />
      <Marquee />
      <Benefits />
      <Services />
      <HowItWorks />
      <FeaturedWork />
      <Products />
      <FAQ />
      <CTA />
    </>
  );
}