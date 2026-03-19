// lib/types.ts
//
// TypeScript interfaces that describe the shape of data
// coming back from Sanity queries.
//
// Think of these as contracts — when you fetch a case study
// from Sanity and say it's type CaseStudy, TypeScript will
// warn you if you try to access a field that doesn't exist,
// and give you autocomplete for fields that do.
//
// Important: these reflect what your GROQ queries return,
// not the full Sanity schema. If your query only asks for
// name and slug, your interface should only have name and slug.
// We'll keep them in sync as we write queries later.

// ── Sanity Image ─────────────────────────────────────────
// Sanity stores images as references to asset documents.
// After our GROQ query resolves the reference, this is
// the shape we get back.
export interface SanityImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// ── Service ───────────────────────────────────────────────
export interface Service {
  _id:        string;
  name:       string;
  slug:       string;
  tagline?:   string;
  description: string;
  features?:  string[];
  price?:     number;
  featured?:  boolean;
}

// ── Case Study (card) ─────────────────────────────────────
// Used on the /work grid page — only the fields we need
// to render a card. No body content yet.
export interface CaseStudyCard {
  _id:         string;
  title:       string;
  slug:        string;
  client:      string;
  year:        number;
  summary:     string;
  tags?:       string[];
  featured?:   boolean;
  coverImage?: SanityImage;
  services?:   Pick<Service, "name" | "slug">[];
}

// ── Case Study (full) ─────────────────────────────────────
// Used on the /work/[slug] detail page — extends the card
// with body content and results metrics.
export interface CaseStudy extends CaseStudyCard {
  liveUrl?: string;
  // Portable Text is an array of block objects. The exact
  // internal shape is handled by @portabletext/react so
  // we type it as any[] here — it's the one place we allow it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?:    any[];
  results?: {
    label: string;
    value: string;
  }[];
}

// ── Site Settings ─────────────────────────────────────────
export interface SiteSettings {
  siteName?:        string;
  tagline?:         string;
  metaDescription?: string;
  email?:           string;
  location?:        string;
  social?: {
    twitter?:   string;
    github?:    string;
    linkedin?:  string;
    instagram?: string;
  };
  ogImage?: string;
}

// ── About Page ────────────────────────────────────────────
export interface AboutPageData {
  heroHeadline?:   string;
  heroSubheading?: string;
  storyHeadline?:  string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storyBody?:      any[];
  profilePhoto?: {
    url: string;
    alt: string;
  };
  values?: {
    title:       string;
    description: string;
  }[];
  approachHeadline?: string;
  approachBody?:     string;
  techStack?:        string[];
  ctaHeadline?:      string;
  ctaSubtext?:       string;
}