import type { Metadata }  from "next";
import siteConfig          from "@/site.config";
import AboutHero           from "@/components/about/AboutHero";
import Story               from "@/components/about/Story";
import Values              from "@/components/about/Values";
import Approach            from "@/components/about/Approach";
import Skills              from "@/components/about/Skills";
import AboutCTA            from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title:       "About",
  description:
    "Leonis Studios is a New Jersey web design studio built on craft and performance. Meet Hassan Shirazi, the developer behind every project.",
  keywords: [
    "web designer New Jersey",
    "freelance web developer",
    "Next.js developer",
    "small business web design",
    "web design NJ",
    "Hassan Shirazi",
    "Leonis Studios",
  ],
  openGraph: {
    title:       `About — ${siteConfig.name}`,
    description:
      "Leonis Studios is a New Jersey web design studio built on craft and performance. Meet Hassan Shirazi, the developer behind every project.",
    url:         `${siteConfig.url}/about`,
    type:        "website",
    images:      [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       `About — ${siteConfig.name}`,
    description:
      "Leonis Studios is a New Jersey web design studio built on craft and performance.",
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  // ── JSON-LD structured data ──────────────────────────────
  const personSchema = {
    "@context": "https://schema.org",
    "@type":    "Person",
    name:       "Hassan Shirazi",
    jobTitle:   "Web Designer & Developer",
    worksFor: {
      "@type": "Organization",
      name:    "Leonis Studios",
    },
    url:     siteConfig.url,
    address: {
      "@type":           "PostalAddress",
      addressLocality:   "New Jersey",
      addressRegion:     "NJ",
      addressCountry:    "US",
    },
    knowsAbout: [
      "Web Design",
      "Next.js",
      "TypeScript",
      "SEO",
      "Sanity CMS",
      "React",
      "Tailwind CSS",
    ],
  };

  const localBusinessSchema = {
    "@context":   "https://schema.org",
    "@type":      "ProfessionalService",
    name:         "Leonis Studios",
    description:  siteConfig.description,
    url:          siteConfig.url,
    email:        siteConfig.email,
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name:    "Hassan Shirazi",
    },
    address: {
      "@type":         "PostalAddress",
      addressLocality: "New Jersey",
      addressRegion:   "NJ",
      addressCountry:  "US",
    },
    areaServed:    "United States",
    serviceType: [
      "Web Design",
      "Web Development",
      "SEO Optimization",
      "Website Maintenance",
    ],
    priceRange: "$$",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <AboutHero />
      <Story />
      <Values />
      <Approach />
      <Skills />
      <AboutCTA />
    </>
  );
}
