import type { Metadata } from "next";
import type { BreadcrumbList, WithContext } from "schema-dts";
import Link from "next/link";
import siteConfig from "@/site.config";
import JsonLd from "@/components/JsonLd";
import { colors } from "@/lib/colors";
import { tokens } from "@/lib/tokens";

// Privacy policy for the mobile apps Leonis Studios publishes
// (Vellis, CodeJump). App Store Connect / Google Play link here,
// one URL per app via the #vellis / #codejump anchors. Static
// content — no Sanity fetch, so the policy can't silently change
// or disappear if the CMS is unavailable.

const EFFECTIVE_DATE = "October 25, 2026";

const description =
  "Privacy policy for the mobile apps published by Leonis Studios, including Vellis and CodeJump: what each app stores, what leaves your device, and your rights.";

export const metadata: Metadata = {
  title: "App Privacy Policy",
  description,
  openGraph: {
    title:       `App Privacy Policy — ${siteConfig.name}`,
    description,
    url:         `${siteConfig.url}/privacy`,
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       `App Privacy Policy — ${siteConfig.name}`,
    description,
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

// ── Prose primitives ─────────────────────────────────────────
// Light-bg text styles, kept local since no other page renders
// long-form legal copy outside Portable Text.

const linkStyle = { color: colors.antiqueGold, textDecoration: "underline" } as const;

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-16 mb-4 pt-10 scroll-mt-28"
      style={{
        fontFamily:    "var(--font-display)",
        fontWeight:    tokens.weightDisplay,
        fontSize:      "clamp(28px, 3.5vw, 42px)",
        lineHeight:    1.1,
        letterSpacing: "-0.02em",
        color:         colors.textBody,
        borderTop:     `1px solid ${colors.borderLight}`,
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mt-10 mb-3"
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: tokens.weightHeading,
        fontSize:   tokens.fontSizes.h3Compact,
        color:      colors.textBody,
      }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-4"
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: tokens.weightBody,
        fontSize:   tokens.fontSizes.body,
        lineHeight: 1.75,
        color:      colors.textBody,
      }}
    >
      {children}
    </p>
  );
}

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul
      className="mb-5 pl-6 space-y-2 list-disc"
      style={{
        fontFamily: "var(--font-body)",
        fontWeight: tokens.weightBody,
        fontSize:   tokens.fontSizes.body,
        lineHeight: 1.75,
        color:      colors.textBody,
      }}
    >
      {children}
    </ul>
  );
}

function Email() {
  return <a href={`mailto:${siteConfig.email}`} style={linkStyle}>{siteConfig.email}</a>;
}

const toc = [
  { id: "all-apps", label: "All apps" },
  { id: "vellis",   label: "Vellis" },
  { id: "codejump", label: "CodeJump" },
  { id: "children", label: "Children" },
  { id: "rights",   label: "Your rights" },
  { id: "contact",  label: "Contact" },
];

export default function PrivacyPage() {
  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "App Privacy Policy", item: `${siteConfig.url}/privacy` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* ── Header ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-40 pb-20" style={{ background: colors.bgDark }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12" style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px" style={{ background: colors.accent }} />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI, color: colors.accent }}
            >
              Leonis Studios Apps
            </span>
          </div>

          <h1
            style={{
              fontFamily:    "var(--font-display)",
              fontSize:      "clamp(44px, 7vw, 96px)",
              fontWeight:    tokens.weightDisplay,
              lineHeight:    0.95,
              letterSpacing: "-0.03em",
              color:         colors.bgLight,
            }}
          >
            App Privacy <span style={{ color: colors.accent }}>Policy.</span>
          </h1>

          <p
            className="mt-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   tokens.fontSizes.bodyLarge,
              fontWeight: tokens.weightBody,
              color:      colors.textSecondary,
              maxWidth:   "640px",
              lineHeight: 1.75,
            }}
          >
            Alongside building websites for clients, Leonis Studios designs and publishes its own
            mobile apps. This page covers those apps: what each one stores, and what, if anything,
            leaves your device.
          </p>

          <p
            className="mt-6 text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI, color: colors.textSecondaryLight }}
          >
            Effective {EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      {/* ── Policy body ─────────────────────────────────────── */}
      <section style={{ background: colors.bgLight, position: "relative", zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <article className="max-w-3xl">

            <P>
              This policy covers the apps Leonis Studios (&ldquo;we&rdquo;, &ldquo;us&rdquo;) publishes on the
              App Store and Google Play. The general rules below apply to every app, and each app has its own
              section saying exactly what it stores and what, if anything, leaves your device. It does not cover
              client websites we build, which are operated by those clients under their own policies.
              Contact: <Email />.
            </P>

            <nav aria-label="On this page" className="mt-8">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-xs tracking-[0.2em] uppercase"
                      style={{ fontFamily: "var(--font-display)", fontWeight: tokens.weightUI, color: colors.antiqueGold }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <H2 id="all-apps">For all our apps</H2>
            <UL>
              <li>No ads, no advertising or analytics SDKs, and no tracking across other companies&rsquo; apps or websites.</li>
              <li>We never sell your data or share it for advertising.</li>
              <li>Your data stays on your device unless an app&rsquo;s section below says otherwise, and anything that does leave is only what&rsquo;s needed for a feature you choose to use.</li>
              <li>Data stored on your device can be included in your device&rsquo;s own backups, following your device settings. Deleting an app deletes its on-device data.</li>
              <li>Fonts and other assets are bundled inside the apps; they make no requests to Google Fonts or similar services.</li>
            </UL>

            <H2 id="vellis">Vellis</H2>
            <P>Vellis is a workout planner and tracker.</P>

            <H3>The short version</H3>
            <UL>
              <li>Your training data lives on your device. Vellis works fully without an account.</li>
              <li>Apple Health / Health Connect data is read and written only if you connect it, stays on your device, and is never used for advertising.</li>
              <li>An account is optional. If you create one, we store your email and the social features you use (handle, friends, shared badges and records, reactions, reports).</li>
              <li>The AI-written weekly summary is off by default. If you turn it on, a few weekly totals are sent to Anthropic&rsquo;s Claude to write it.</li>
            </UL>

            <H3>Data stored only on your device</H3>
            <P>
              Workouts, sets, routines, schedules, mesocycles, personal records, badges and XP, body measurements
              (weight, body fat) and progress photos, daily readiness check-ins, nutrition settings (age, sex,
              height, weight, activity level, diet phase), and your profile (display name, experience level,
              units). It&rsquo;s stored in the app&rsquo;s local database and is never uploaded by Vellis.
            </P>

            <H3>Apple Health and Health Connect</H3>
            <P>Only if you connect Health from Profile &gt; Privacy &amp; data:</P>
            <UL>
              <li><strong>Read:</strong> heart rate variability, resting heart rate, and step count, used to calculate your daily readiness score.</li>
              <li><strong>Write:</strong> your completed workouts (start and end time), so they appear in Health.</li>
            </UL>
            <P>
              Health data is stored only in the app&rsquo;s local database on your device. It is not sent to our
              servers or any third party, not used for advertising, marketing or data mining, and Vellis never
              syncs it to iCloud (it can be part of your device&rsquo;s own encrypted backup). The only exception
              is the optional AI summary below, which may include your average readiness score for the week (a
              number calculated partly from Health data) if you turn that feature on. You can revoke access at
              any time in the Health app (Sharing &gt; Apps &gt; Vellis) or in Health Connect.
            </P>

            <H3>Optional account</H3>
            <P>Creating an account enables friends and sharing. When you create one we store, with our backend provider Supabase:</P>
            <UL>
              <li>your email address and an account ID (for sign-in);</li>
              <li>your public handle and avatar choice;</li>
              <li>friend requests and friendships, and people you block;</li>
              <li>badges and personal records you choose to share, and reactions you give;</li>
              <li>in-app notifications about that activity;</li>
              <li>reports you file about other users or posts, including any details you write.</li>
            </UL>
            <P>
              Your workouts and other on-device data are not uploaded by signing in. Friends see only your handle,
              avatar, and what you choose to share.
            </P>

            <H3>Optional AI-written weekly summary</H3>
            <P>
              Off by default. If you turn it on (Profile &gt; Privacy &amp; data), once a week the app sends your
              total training volume for this week and last week, your number of new personal records, and your
              average readiness score to our server, which forwards them to Anthropic&rsquo;s Claude API to write
              a short summary. Nothing identifying you (name, email, handle) is included. Anthropic processes this
              under its commercial API terms, which do not allow it to train models on this data. Turn it off at
              any time and summaries are written on your device again.
            </P>

            <H3>Daily reminders</H3>
            <P>
              The optional daily reminder is a local notification scheduled on your device. Nothing is sent to us
              or to a push service to deliver it. Turn it off in Profile &gt; Reminders or in your device&rsquo;s
              notification settings.
            </P>

            <H3>Deleting your Vellis data</H3>
            <UL>
              <li><strong>Account and server data:</strong> Profile &gt; Account &gt; Delete account permanently deletes your account and everything stored with it on our servers, and wipes the app&rsquo;s local data.</li>
              <li><strong>Device data:</strong> delete the app.</li>
              <li>You can also email us to request deletion or a copy of your data.</li>
            </UL>

            <H3>Security</H3>
            <P>
              Account data is sent over encrypted connections (HTTPS) and protected by per-user access rules on
              our backend. On-device data is protected by your device&rsquo;s own security.
            </P>

            <H2 id="codejump">CodeJump</H2>
            <P>CodeJump is a puzzle game that teaches coding with short, real-code quests.</P>
            <UL>
              <li><strong>We collect nothing.</strong> CodeJump has no account, no sign-in, and no connection to our servers or anyone else&rsquo;s. It doesn&rsquo;t ask for your name, email, location, contacts, photos, or any other personal information.</li>
              <li><strong>On your device only:</strong> your quest scores, attempt history, XP and level, chosen track, settings, and &ldquo;more like this / less like this&rdquo; feedback taps. They&rsquo;re kept in the app&rsquo;s local storage and never leave your device.</li>
              <li><strong>Your code stays with you:</strong> code you write in CodeJump runs inside the app, on your device, in a built-in sandbox with no internet or file access. It is never uploaded.</li>
              <li><strong>Deleting your data:</strong> use Reset progress on the Home screen, or delete the app.</li>
            </UL>

            <H2 id="children">Children</H2>
            <P>
              CodeJump is made for players of all ages, including children. Because it collects no personal
              information from anyone, it collects none from children, and it has no ads, in-app purchases,
              chat, or social features.
            </P>
            <P>
              Vellis is not directed to children under 13 (or under 16 in the EU/UK), and we don&rsquo;t knowingly
              collect their data. If you believe a child has created a Vellis account, email us and we&rsquo;ll
              delete it.
            </P>

            <H2 id="rights">Your rights</H2>
            <P>
              Depending on where you live (for example under the GDPR or CCPA), you may have the right to access,
              correct, delete, or port your personal data, or to object to its processing. Most of our apps keep
              your data only on your device, where you control it directly. For anything we hold (such as a
              Vellis account), email us and we&rsquo;ll respond within 30 days.
            </P>

            <H2 id="changes">Changes</H2>
            <P>
              If this policy changes we&rsquo;ll update the date above and, for material changes, tell you in the
              affected app. When we release a new app, we&rsquo;ll add its own section here before it&rsquo;s
              available.
            </P>

            <H2 id="contact">Contact</H2>
            <P>
              {siteConfig.name} · <Email /> · {siteConfig.location}
            </P>
            <P>
              Looking for a website for your business instead?{" "}
              <Link href="/contact" style={linkStyle}>Get a free quote</Link>.
            </P>

          </article>
        </div>
      </section>
    </>
  );
}
