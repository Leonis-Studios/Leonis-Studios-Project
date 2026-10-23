import type { Metadata }  from "next";
import type { ContactPage as ContactPageSchema, BreadcrumbList, WithContext } from "schema-dts";
import siteConfig          from "@/site.config";
import { client }          from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY, CONTACT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings, ContactPageData } from "@/lib/types";
import JsonLd               from "@/components/JsonLd";
import ContactHero         from "@/components/contact/ContactHero";
import ContactSection      from "@/components/contact/ContactSection";

const defaultDescription =
  "Get a free quote for a website built to generate leads. Tell Leonis Studios about your business and hear back within 24 hours with a plan and pricing.";

export async function generateMetadata(): Promise<Metadata> {
  const contactPage: ContactPageData | null = await client
    .fetch(CONTACT_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const title       = contactPage?.seo?.metaTitle       ?? "Contact";
  const description = contactPage?.seo?.metaDescription ?? defaultDescription;
  const ogImage      = contactPage?.seo?.ogImage;

  return {
    title,
    description,
    keywords: [
      "free website quote",
      "lead generation website quote",
      "hire web designer",
      "SEO web design quote",
      "New York web design",
      "small business website cost",
    ],
    openGraph: {
      title:       `Get a Free Quote — ${siteConfig.name}`,
      description,
      url:         `${siteConfig.url}/contact`,
      type:        "website",
      images:      ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `Get a Free Quote — ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/contact`,
    },
    robots: contactPage?.seo?.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function ContactPage() {
  const settings: SiteSettings | null = await client
    .fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const email    = settings?.email    ?? siteConfig.email;
  const location = settings?.location ?? siteConfig.location;

  const contactPage: ContactPageData | null = await client
    .fetch(CONTACT_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  // ── JSON-LD structured data ──────────────────────────────
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type":    "ContactPage",
    name:       "Contact Leonis Studios",
    description: contactPage?.seo?.metaDescription ?? defaultDescription,
    url:         `${siteConfig.url}/contact`,
    mainEntity: {
      "@type":    "Organization",
      name:       siteConfig.name,
      email,
      url:        siteConfig.url,
      address: {
        "@type":         "PostalAddress",
        addressLocality: "New York",
        addressRegion:   "NY",
        addressCountry:  "US",
      },
    },
  } as const;
  const jsonLd = jsonLdData as WithContext<ContactPageSchema>;

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.url}/contact` },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbSchema} />
      <ContactHero hero={contactPage?.hero} />
      <ContactSection siteEmail={email} location={location} />
    </>
  );
}
