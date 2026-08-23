import type { Metadata } from "next";
import type { Person, ProfessionalService, BreadcrumbList, WithContext } from "schema-dts";
import siteConfig from "@/site.config";
import { client } from "@/sanity/lib/client";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import type { AboutPageData } from "@/lib/types";
import JsonLd from "@/components/JsonLd";
import AboutHero from "@/components/about/AboutHero";
import Story from "@/components/about/Story";
import Values from "@/components/about/Values";
import ClientPromise from "@/components/about/ClientPromise";
import Skills from "@/components/about/Skills";
import AboutCTA from "@/components/about/AboutCTA";

const defaultDescription =
  "Leonis Studios is a New York studio building fast, custom websites with SEO and AI search built in. Meet Hassan Shirazi, the person behind every project.";

export async function generateMetadata(): Promise<Metadata> {
  const data: AboutPageData | null = await client
    .fetch(ABOUT_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const title       = data?.seo?.metaTitle       ?? "About";
  const description = data?.seo?.metaDescription ?? defaultDescription;
  const ogImage      = data?.seo?.ogImage;

  return {
    title,
    description,
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
      description,
      url: `${siteConfig.url}/about`,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `About — ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/about`,
    },
    robots: data?.seo?.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function AboutPage() {
  const data: AboutPageData | null = await client
    .fetch(ABOUT_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  // ── JSON-LD structured data ──────────────────────────────
  const personData = {
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
  } as const;
  const personSchema = personData as WithContext<Person>;

  const localBusinessData = {
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
  } as const;
  const localBusinessSchema = localBusinessData as WithContext<ProfessionalService>;

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteConfig.url}/about` },
    ],
  };

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />
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
