// app/(site)/layout.tsx
//
// The (site) folder is a Route Group — the parentheses tell
// Next.js NOT to include "(site)" in the URL. It's purely
// an organisational tool.
//
// This layout wraps all public pages (home, work, about,
// contact) with the Navbar and Footer, while leaving
// /studio completely separate with its own shell.

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}