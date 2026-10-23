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
  const ogImage = settings?.ogImage;

  return {
    metadataBase: new URL(url),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s — ${name}`,
    },
    description,
    openGraph: {
      type:      "website",
      siteName:  name,
      url,
      images:    ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${name} — ${tagline}`,
      description,
      images:      ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    // Search Console HTML-tag verification. Set GOOGLE_SITE_VERIFICATION
    // in Vercel to the content="..." value Search Console gives you.
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    icons: {
      icon: [
        { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-icon.png",
    },
    manifest: "/manifest.webmanifest",
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
