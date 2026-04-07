import type { Metadata } from "next";
import "./globals.css";
import { client } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/lib/types";
import siteConfig from "@/site.config";

export async function generateMetadata(): Promise<Metadata> {
  const settings: SiteSettings | null = await client
    .fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 3600 } })
    .catch(() => null);

  const name = settings?.siteName ?? siteConfig.name;
  const tagline = settings?.tagline ?? siteConfig.tagline;
  const description = settings?.metaDescription ?? siteConfig.description;
  const url = siteConfig.url;

  return {
    metadataBase: new URL(url),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s — ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      siteName: name,
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
