// site.config.ts
//
// This is the single source of truth for site-wide information.
// Instead of hardcoding your site name, URL, or nav links in
// multiple places, you define them once here and import this
// file wherever you need it.
//
// When you change your email, add a nav link, or update your
// description, you change it in one place and it updates
// everywhere automatically.

const siteConfig = {
  name: "Leonis Studios",
  tagline: "Websites That Bring In Leads",
  description:
    "Leonis Studios designs custom websites that turn visitors into leads, built to rank on Google and get recommended by AI tools like ChatGPT.",

  // Must match the host Vercel serves as primary (the apex redirects
  // to www). Canonicals, sitemap, and JSON-LD all build from this, so
  // pointing it at a redirecting host confuses Google's indexing.
  url: "https://www.leonisstudios.com",
  email: "hassan.shirazi@leonisstudios.com",
  location: "New York, NY",

  // Social links — set to "" to hide a platform
  social: {
    twitter: "",
    linkedin: "",
  },

  // These drive the Navbar links — add or remove items here
  // and the Navbar updates automatically. No touching component code.
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
//  ^ "as const" tells TypeScript to treat every value as a
//    literal type, not just a generic string. This gives you
//    autocomplete and type safety when you use siteConfig
//    elsewhere in the codebase.

export default siteConfig;
