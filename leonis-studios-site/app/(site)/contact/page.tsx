import type { Metadata }  from "next";
import siteConfig          from "@/site.config";
import { client }          from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY, CONTACT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings, ContactPageData } from "@/lib/types";
import ContactHero         from "@/components/contact/ContactHero";
import ContactSection      from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title:       "Contact",
  description:
    "Ready to hire a web designer? Tell Leonis Studios about your project and get a response within 24 hours. Web design quotes for New York small businesses.",
  keywords: [
    "hire web designer",
    "web design quote",
    "website project inquiry",
    "web development consultation",
    "New York web design",
    "Next.js developer for hire",
  ],
  openGraph: {
    title:       `Start a Project — ${siteConfig.name}`,
    description:
      "Ready to hire a web designer? Tell Leonis Studios about your project and get a response within 24 hours.",
    url:         `${siteConfig.url}/contact`,
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       `Start a Project — ${siteConfig.name}`,
    description:
      "Ready to hire a web designer? Get a response from Leonis Studios within 24 hours.",
  },
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "ContactPage",
    name:       "Contact Leonis Studios",
    description: metadata.description,
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactHero hero={contactPage?.hero} />
      <ContactSection siteEmail={email} location={location} />
    </>
  );
}
