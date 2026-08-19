# Content Guidelines — SEO / AEO / GEO

Editorial guidance for anyone writing content in Sanity Studio (blog posts, case studies, FAQ, page copy). This applies to the Studio, not the codebase — no code enforces these rules, they're a writing checklist.

## The answer-capsule pattern

Search engines, featured snippets, and AI assistants (ChatGPT, Perplexity, Claude, Google's AI Overviews) all favor content that states its point before elaborating. Write every major section so it works if only the first sentence or two gets quoted.

**Rule of thumb**: lead each section with a 40–60 word direct answer to a question-shaped heading, then elaborate below it.

Bad:
> ## How long does a website redesign take?
> There are a lot of factors that go into a redesign timeline — the size of the site, how many rounds of feedback are needed, whether content is ready, and so on. Generally speaking, most projects...

Good:
> ## How long does a website redesign take?
> Most Leonis Studios redesigns take 4–6 weeks from kickoff to launch, depending on site size and how quickly feedback rounds close. Larger sites with custom features can run 8–10 weeks.
>
> The biggest factor is usually content readiness — projects with copy and images ready on day one move fastest...

## Formatting for extraction

- **Numbered lists** for anything sequential (a process, steps to do something). AI assistants and Google both prefer numbered lists over prose when summarizing "how to" content.
- **Tables** for comparisons (package tiers, before/after, feature matrices).
- **Short paragraphs** (2–4 sentences). Long unbroken paragraphs are harder to extract a clean quote from.

## Excerpts, summaries, and meta descriptions

The `excerpt` field on blog posts, `summary` on case studies, and the `Meta Description Override` in the SEO panel should all follow the same rule: **write them as a standalone answer**, not a teaser. A reader (or an AI assistant) should get real information from the excerpt alone, not just curiosity bait.

- Bad: "Find out how we helped this client grow their business online."
- Good: "How Leonis Studios rebuilt a cabling contractor's site on Next.js, cutting load time from 4.2s to 0.8s and tripling organic search traffic in 90 days."

## FAQ answers

The FAQ block (on posts and case studies) and the global FAQ (home page) both follow the same rule:

- Phrase questions the way a real person would search or ask an assistant — natural language, not marketing-speak. ("How much does a website cost?" not "Pricing Information".)
- Each answer should be **self-contained** — understandable without reading the rest of the page. FAQ answers get pulled out of context by search engines and AI assistants, so they can't rely on surrounding paragraphs for meaning.
- Keep answers to 2–4 sentences. If an answer needs more than that, it's probably better as its own section with a heading, linked from the FAQ.

## Where this applies

- Blog post `excerpt`, `body` section headings, `faq` block
- Case study `summary`, `body` section headings, `faq` block
- Any `seo.metaDescription` override
- The global FAQ (`faqItem` documents, shown on the home page)
