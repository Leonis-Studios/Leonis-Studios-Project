import type { Metadata } from "next";
import siteConfig from "@/site.config";
import { client } from "@/sanity/lib/client";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { AboutPageData } from "@/lib/types";
import AboutHero from "@/components/about/AboutHero";
import Story from "@/components/about/Story";
import Values from "@/components/about/Values";
import ClientPromise from "@/components/about/ClientPromise";
import Skills from "@/components/about/Skills";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Leonis Studios is a New York web design studio built on craft and performance. Meet Hassan Shirazi, the developer behind every project.",
  keywords: [
    "web designer New York",
    "freelance web developer",
    "Next.js developer",
    "small business web design",
    "web design NYC",
    "Hassan Shirazi",
    "Leonis Studios",
  ],
  openGraph: {
    title: `About — ${siteConfig.name}`,
    description:
      "Leonis Studios is a New York web design studio built on craft and performance. Meet Hassan Shirazi, the developer behind every project.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About — ${siteConfig.name}`,
    description:
      "Leonis Studios is a New York web design studio built on craft and performance.",
  },
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default async function AboutPage() {
  const data: AboutPageData | null = await client
    .fetch(ABOUT_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  // ── JSON-LD structured data ──────────────────────────────
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hassan Shirazi",
    jobTitle: "Web Designer & Developer",
    worksFor: {
      "@type": "Organization",
      name: "Leonis Studios",
    },
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
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
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Leonis Studios",
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.email,
    foundingDate: "2024",
    founder: {
      "@type": "Person",
      name: "Hassan Shirazi",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    areaServed: "United States",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <AboutHero
        headline={data?.heroHeadline}
        subheading={data?.heroSubheading}
      />
      <Story eyebrow={data?.storyEyebrow} storyBody={data?.storyBody} />
      <Values eyebrow={data?.valuesEyebrow} values={data?.values} />
      <ClientPromise
        eyebrow={data?.promisesEyebrow}
        headline={data?.promisesHeadline}
        subheading={data?.promisesSubheading}
        promises={data?.promises}
      />
      <Skills eyebrow={data?.skillsEyebrow} techStack={data?.techStack} servicesList={data?.servicesList} />
      <AboutCTA ctaHeadline={data?.ctaHeadline} ctaSubtext={data?.ctaSubtext} />
    </>
  );
}
