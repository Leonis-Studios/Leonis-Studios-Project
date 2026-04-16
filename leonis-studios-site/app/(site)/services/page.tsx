import type { Metadata }    from "next";
import siteConfig            from "@/site.config";
import { client }            from "@/sanity/lib/client";
import { ALL_SERVICES_QUERY } from "@/sanity/lib/queries";
import type { Service }      from "@/lib/types";
import ServicesHero          from "@/components/services/ServicesHero";
import ServicesPackages      from "@/components/services/ServicesPackages";
import ServicesRetainers     from "@/components/services/ServicesRetainers";
import ServicesAddons        from "@/components/services/ServicesAddons";
import ServicesCTA           from "@/components/services/ServicesCTA";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Leonis Studios offers website packages, monthly retainers, and add-on services for businesses ready to stand out. Explore our craft-first approach to web design and growth.",
  keywords: [
    "web design services",
    "website packages New Jersey",
    "monthly retainer web design",
    "SEO services New Jersey",
    "Next.js website design",
    "small business web design NJ",
    "Leonis Studios services",
    "website maintenance",
    "web development packages",
  ],
  openGraph: {
    title:       `Services — ${siteConfig.name}`,
    description:
      "Leonis Studios offers website packages, monthly retainers, and add-on services for businesses ready to stand out.",
    url:  `${siteConfig.url}/services`,
    type: "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       `Services — ${siteConfig.name}`,
    description:
      "Leonis Studios offers website packages, monthly retainers, and add-on services for businesses ready to stand out.",
  },
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

export default async function ServicesPage() {
  const allServices: Service[] = await client
    .fetch(ALL_SERVICES_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => []);

  const packages  = allServices.filter((s) => s.category === "package");
  const retainers = allServices.filter((s) => s.category === "retainer");
  const addons    = allServices.filter((s) => s.category === "addon");

  // ── JSON-LD structured data ──────────────────────────────
  const itemListSchema = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ServicesHero />
      <ServicesPackages  services={packages} />
      <ServicesRetainers services={retainers} />
      <ServicesAddons    services={addons} />
      <ServicesCTA />
    </>
  );
}
