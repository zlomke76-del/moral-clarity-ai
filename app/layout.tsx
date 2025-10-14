import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moralclarity.ai"),
  title: { default: "Moral Clarity AI", template: "%s • Moral Clarity AI" },
  description: "Anchored answers. Neutral • Guidance • Ministry.",
  openGraph: { type: "website", siteName: "Moral Clarity AI", url: "https://www.moralclarity.ai" },
  twitter: { card: "summary_large_image", site: "@", creator: "@" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold">Moral Clarity AI</Link>
            <div className="flex gap-6 text-sm">
              <Link href="/app">Try</Link>
              <Link href="/subscribe">Pricing</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 py-12 text-sm text-zinc-400">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} Moral Clarity AI</span>
            <div className="flex gap-6">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/status">Status</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
