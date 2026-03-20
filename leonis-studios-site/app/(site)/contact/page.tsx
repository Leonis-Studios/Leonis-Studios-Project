import type { Metadata }  from "next";
import siteConfig          from "@/site.config";
import ContactHero         from "@/components/contact/ContactHero";
import ContactSection      from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title:       "Contact",
  description:
    "Ready to hire a web designer? Tell Leonis Studios about your project and get a response within 24 hours. Web design quotes for NJ small businesses.",
  keywords: [
    "hire web designer",
    "web design quote",
    "website project inquiry",
    "web development consultation",
    "New Jersey web design",
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

export default function ContactPage() {
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
      email:      siteConfig.email,
      url:        siteConfig.url,
      address: {
        "@type":         "PostalAddress",
        addressLocality: "New Jersey",
        addressRegion:   "NJ",
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
      <ContactHero />
      <ContactSection />
    </>
  );
}
