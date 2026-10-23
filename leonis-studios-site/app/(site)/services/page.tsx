import type { Metadata }    from "next";
import type { ItemList, BreadcrumbList, FAQPage, WithContext } from "schema-dts";
import siteConfig            from "@/site.config";
import { client }            from "@/sanity/lib/client";
import { ALL_SERVICES_QUERY, SERVICES_PAGE_QUERY, FAQ_ITEMS_QUERY } from "@/sanity/lib/queries";
import type { Service, ServicesPageData, FaqItem } from "@/lib/types";
import JsonLd                 from "@/components/JsonLd";
import ServicesHero          from "@/components/services/ServicesHero";
import ServicesPackages      from "@/components/services/ServicesPackages";
import ServicesRetainers     from "@/components/services/ServicesRetainers";
import ServicesAddons        from "@/components/services/ServicesAddons";
import ServicesCTA           from "@/components/services/ServicesCTA";
import ContentFAQ            from "@/components/shared/ContentFAQ";

const defaultDescription =
  "Lead generation website packages with custom design, SEO, and AI search optimization built in. Clear pricing, plus monthly retainers to keep growing.";

export async function generateMetadata(): Promise<Metadata> {
  const servicesPage: ServicesPageData | null = await client
    .fetch(SERVICES_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const title       = servicesPage?.seo?.metaTitle       ?? "Services";
  const description = servicesPage?.seo?.metaDescription ?? defaultDescription;
  const ogImage      = servicesPage?.seo?.ogImage;

  return {
    title,
    description,
    keywords: [
      "lead generation website packages",
      "website design pricing",
      "SEO web design packages",
      "GEO and AEO services",
      "AI search optimization services",
      "local SEO retainer",
      "small business web design NYC",
      "website maintenance retainer",
      "Leonis Studios pricing",
    ],
    openGraph: {
      title:       `Services — ${siteConfig.name}`,
      description,
      url:  `${siteConfig.url}/services`,
      type: "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `Services — ${siteConfig.name}`,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/services`,
    },
    // Spread, not `robots: undefined` — an explicit undefined key
    // overrides the root layout's robots/googleBot directives.
    ...(servicesPage?.seo?.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ServicesPage() {
  const allServices: Service[] = await client
    .fetch(ALL_SERVICES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  const servicesPage: ServicesPageData | null = await client
    .fetch(SERVICES_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  // Pricing + process questions answered right next to the prices —
  // the page most likely to be cited for "how much does X cost" queries.
  const faqItems: FaqItem[] = await client
    .fetch(FAQ_ITEMS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);
  const servicesFaq = faqItems
    .filter((f) => f.category === "pricing" || f.category === "process")
    .map((f) => ({ _key: f._id, question: f.question, answer: f.answer }));

  const packages  = allServices.filter((s) => s.category === "package");
  const retainers = allServices.filter((s) => s.category === "retainer");
  const addons    = allServices.filter((s) => s.category === "addon");

  // ── JSON-LD structured data ──────────────────────────────
  const itemListData = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Leonis Studios Services",
    url:        `${siteConfig.url}/services`,
    itemListElement: allServices.map((service, index) => ({
      "@type":   "ListItem",
      position:  index + 1,
      name:      service.name,
      url:       `${siteConfig.url}/services`,
      item: {
        "@type":      "Service",
        name:         service.name,
        description:  service.description,
        provider: {
          "@type": "Organization",
          "@id":   `${siteConfig.url}/#organization`,
          name:    "Leonis Studios",
          url:     siteConfig.url,
        },
        areaServed: { "@type": "Country", name: "United States" },
        ...(service.startingPrice
          ? {
              offers: {
                "@type":         "Offer",
                price:           service.startingPrice,
                priceCurrency:   "USD",
                availability:    "https://schema.org/InStock",
              },
            }
          : {}),
      },
    })),
  } as const;
  const itemListSchema = itemListData as unknown as WithContext<ItemList>;

  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
    ],
  };

  const faqSchema: WithContext<FAQPage> | null = servicesFaq.length
    ? {
        "@context": "https://schema.org",
        "@type":    "FAQPage",
        mainEntity: servicesFaq.map((f) => ({
          "@type": "Question",
          name:    f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={itemListSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <ServicesHero hero={servicesPage?.hero} />
      <ServicesPackages  services={packages}  section={servicesPage?.packagesSection} />
      <ServicesRetainers services={retainers} section={servicesPage?.retainersSection} />
      <ServicesAddons    services={addons}    section={servicesPage?.addonsSection} />
      <ContentFAQ items={servicesFaq} eyebrow="Pricing & Process" headline="Common questions before you start." />
      <ServicesCTA section={servicesPage?.ctaSection} />
    </>
  );
}
