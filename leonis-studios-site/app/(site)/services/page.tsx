import type { Metadata }    from "next";
import type { ItemList, BreadcrumbList, WithContext } from "schema-dts";
import siteConfig            from "@/site.config";
import { client }            from "@/sanity/lib/client";
import { ALL_SERVICES_QUERY, SERVICES_PAGE_QUERY } from "@/sanity/lib/queries";
import type { Service, ServicesPageData } from "@/lib/types";
import JsonLd                 from "@/components/JsonLd";
import ServicesHero          from "@/components/services/ServicesHero";
import ServicesPackages      from "@/components/services/ServicesPackages";
import ServicesRetainers     from "@/components/services/ServicesRetainers";
import ServicesAddons        from "@/components/services/ServicesAddons";
import ServicesCTA           from "@/components/services/ServicesCTA";

const defaultDescription =
  "Leonis Studios offers website packages, retainers, and SEO, GEO, and AEO services for businesses ready to be found in search and AI answers.";

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
      "web design services",
      "website packages New York",
      "monthly retainer web design",
      "SEO services New York",
      "Next.js website design",
      "small business web design NYC",
      "Leonis Studios services",
      "website maintenance",
      "web development packages",
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
    robots: servicesPage?.seo?.noindex ? { index: false, follow: true } : undefined,
  };
}

export default async function ServicesPage() {
  const allServices: Service[] = await client
    .fetch(ALL_SERVICES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  const servicesPage: ServicesPageData | null = await client
    .fetch(SERVICES_PAGE_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

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
          name:    "Leonis Studios",
          url:     siteConfig.url,
        },
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

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ServicesHero hero={servicesPage?.hero} />
      <ServicesPackages  services={packages}  section={servicesPage?.packagesSection} />
      <ServicesRetainers services={retainers} section={servicesPage?.retainersSection} />
      <ServicesAddons    services={addons}    section={servicesPage?.addonsSection} />
      <ServicesCTA section={servicesPage?.ctaSection} />
    </>
  );
}
