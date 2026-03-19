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
  tagline: "Bold digital craft.",
  description:
    "Leonis Studios builds high-performance websites, drives search growth, and maintains digital infrastructure for businesses that refuse to settle.",

  url: "https://leonisstudios.com", // update when your domain is live
  email: "hassan.shirazi@leonisstudios.com",
  location: "New York, NY",

  // Used for social sharing previews (Open Graph).
  // You'll drop a 1200×630px image in /public and name it og-default.png
  ogImage: "/og-default.png",

  // Social links — set to "" to hide a platform
  social: {
    twitter: "",
    github: "https://github.com/leonis-studios",
    linkedin: "",
  },

  // These drive the Navbar links — add or remove items here
  // and the Navbar updates automatically. No touching component code.
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
//  ^ "as const" tells TypeScript to treat every value as a
//    literal type, not just a generic string. This gives you
//    autocomplete and type safety when you use siteConfig
//    elsewhere in the codebase.

export default siteConfig;
