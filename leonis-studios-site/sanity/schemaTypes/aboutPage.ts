import { defineField, defineType, defineArrayMember } from "sanity";

export const aboutPageSchema = defineType({
  name:  "aboutPage",
  title: "About Page",
  type:  "document",
  icon:  () => "📖",
  fields: [
    // ── Hero section ──────────────────────────────────
    defineField({
      name:        "heroHeadline",
      title:       "Hero Headline",
      type:        "string",
      description: "Large heading at top of about page",
    }),
    defineField({
      name:        "heroSubheading",
      title:       "Hero Subheading",
      type:        "text",
      rows:        2,
      description: "1-2 sentences below the headline",
    }),

    // ── Story section ─────────────────────────────────
    defineField({
      name:        "storyEyebrow",
      title:       "Story Eyebrow Label",
      type:        "string",
      description: 'e.g. "Our Story"',
    }),
    defineField({
      name:        "storyHeadline",
      title:       "Story Section Headline",
      type:        "string",
      description: 'e.g. "The Studio"',
    }),
    defineField({
      name:        "storyBody",
      title:       "Story Body",
      type:        "array",
      description: "Rich text — your studio story, who you are, how Leonis started",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal",    value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold",   value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        }),
      ],
    }),

    // ── Profile photo ─────────────────────────────────
    defineField({
      name:    "profilePhoto",
      title:   "Profile Photo",
      type:    "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name:  "alt",
          title: "Alt Text",
          type:  "string",
        }),
      ],
    }),

    // ── Values ────────────────────────────────────────
    defineField({
      name:        "valuesEyebrow",
      title:       "Values Eyebrow Label",
      type:        "string",
      description: 'e.g. "What We Stand For"',
    }),
    defineField({
      name:        "values",
      title:       "Values / Principles",
      type:        "array",
      description: "The numbered values shown in the What We Stand For section",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title",       title: "Value Name",  type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
    }),

    // ── Approach ──────────────────────────────────────
    defineField({
      name:  "approachHeadline",
      title: "Approach Section Headline",
      type:  "string",
    }),
    defineField({
      name:        "approachBody",
      title:       "Approach Body",
      type:        "text",
      rows:        4,
      description: "How you work with clients",
    }),

    // ── Tech stack ────────────────────────────────────
    defineField({
      name:        "skillsEyebrow",
      title:       "Skills Eyebrow Label",
      type:        "string",
      description: 'e.g. "Stack & Services"',
    }),
    defineField({
      name:        "techStack",
      title:       "Tech Stack",
      type:        "array",
      description: "Each item is a clickable tag with its own explainer paragraph.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Tag Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Explainer Paragraph", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "description" } },
        }),
      ],
      initialValue: [
        { label: "Next.js", description: "Next.js is the framework we build almost every site on. It renders pages fast, handles routing and image optimization out of the box, and gives search engines clean, crawlable pages instead of a slow client-side app." },
        { label: "TypeScript", description: "TypeScript adds real structure to our code, catching mistakes before they ever reach your site. It means fewer bugs slip through and every feature we build is easier to maintain down the road." },
        { label: "React", description: "React is the library that powers the interactive parts of your site, things like hover states, forms, and animations. It has been the industry standard for years, so your site stays easy to hand off or extend later." },
        { label: "Tailwind CSS", description: "Tailwind CSS lets us build custom designs quickly without a mess of leftover styles. It keeps the codebase lean, which means faster load times for your visitors." },
        { label: "Framer Motion", description: "Framer Motion handles the smoother, more deliberate animations you see across a site, things a plain CSS transition cannot pull off. Used well, it makes a site feel considered instead of gimmicky." },
        { label: "Sanity CMS", description: "Sanity CMS is what lets you edit your own content, from headlines to blog posts, without touching code. It updates your live site instantly and it is the same system powering the words on this page." },
        { label: "Vercel", description: "Vercel is where we host and deploy your site. It keeps things fast worldwide, handles traffic spikes without extra setup, and ships updates the moment we push them." },
        { label: "Resend", description: "Resend handles the emails your site sends, like contact form notifications, reliably and without landing in spam. It is a small piece, but it is one of those things you only notice if it breaks." },
        { label: "PostgreSQL", description: "PostgreSQL is the database we reach for when a project needs to store and query structured data reliably. It has been trusted for decades and scales well as a business grows." },
        { label: "Git", description: "Git tracks every change we make to your codebase. It means nothing gets lost, changes can be reviewed before they go live, and we always have a clean history to fall back on." },
      ],
    }),
    defineField({
      name:        "servicesList",
      title:       "Services List",
      type:        "array",
      description: "Each item is a clickable tag with its own explainer paragraph.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Tag Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Explainer Paragraph", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "description" } },
        }),
      ],
      initialValue: [
        { label: "Web Design", description: "We design every site around your brand and your customers, not a template. The goal is a site that looks like you and makes it obvious what you do within a few seconds." },
        { label: "Frontend Development", description: "This is the actual building of your site, turning design into a fast, working product. We write clean code that holds up as your site grows." },
        { label: "CMS Integration", description: "We connect your site to a content system so you can update text, images, and posts yourself. No developer needed for the everyday changes." },
        { label: "SEO Optimization", description: "We structure every page so Google can crawl it, understand it, and rank it for the searches that actually bring you customers. This covers technical SEO, on-page content, and site structure together." },
        { label: "GEO Optimization", description: "GEO, or generative engine optimization, is about showing up inside AI-generated answers and AI-powered search results, not just traditional listings. We structure your content so tools built on generative AI can find it and use it." },
        { label: "AEO Optimization", description: "AEO, or answer engine optimization, is about getting your business cited directly inside tools like ChatGPT and Perplexity when someone asks a relevant question. We write and structure content specifically so those answer engines can pull it accurately." },
        { label: "Performance Audits", description: "We regularly check load times, Core Web Vitals, and technical health, then fix what is holding your site back. A slow site loses visitors and ranks lower, so this is not optional." },
        { label: "Site Maintenance", description: "Ongoing updates, security checks, and small content changes so your site stays healthy after launch. You are never left figuring things out on your own." },
        { label: "Analytics Setup", description: "We set up analytics and search console so you can actually see who is visiting, where they come from, and what is working. Data instead of guesswork." },
        { label: "Email Infrastructure", description: "We set up reliable email delivery for contact forms and notifications, so messages from your site actually reach your inbox instead of getting lost." },
      ],
    }),

    // ── Client Promise ──────────────────────────────────
    defineField({
      name:  "promisesEyebrow",
      title: "Promises Eyebrow Label",
      type:  "string",
      description: 'e.g. "Our Promise"',
    }),
    defineField({
      name:  "promisesHeadline",
      title: "Promises Headline",
      type:  "string",
      description: 'e.g. "What you can always expect."',
    }),
    defineField({
      name:  "promisesSubheading",
      title: "Promises Subheading",
      type:  "text",
      rows:  2,
    }),
    defineField({
      name:        "promises",
      title:       "Promises",
      type:        "array",
      description: "The client commitment cards",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body",  title: "Body",  type: "text", rows: 2 }),
          ],
          preview: { select: { title: "title", subtitle: "body" } },
        }),
      ],
    }),

    // ── CTA ───────────────────────────────────────────
    defineField({
      name:        "ctaHeadline",
      title:       "CTA Headline",
      type:        "string",
      description: 'e.g. "Ready to work together?"',
    }),
    defineField({
      name:    "ctaSubtext",
      title:   "CTA Subtext",
      type:    "string",
    }),

    // ── SEO ─────────────────────────────────────────────
    defineField({
      name:  "seo",
      title: "SEO",
      type:  "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
