import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moralclarity.ai"),
  title: { default: "Moral Clarity AI", template: "%s • Moral Clarity AI" },
  description: "Anchored answers. Neutral • Guidance • Ministry.",
  openGraph: {
    type: "website",
    siteName: "Moral Clarity AI",
    url: "https://www.moralclarity.ai",
  },
  twitter: {
    card: "summary_large_image",
    site: "@",
    creator: "@",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            {/* Brand (text only — removed broken image) */}
            <Link href="/" className="brand font-semibold tracking-tight">
              Moral Clarity AI
            </Link>

            {/* Desktop navigation */}
            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/pricing" className="hover:opacity-80">
                Pricing
              </Link>
              <Link href="/docs" className="hover:opacity-80">
                Docs
              </Link>
              <Link href="/contact" className="hover:opacity-80">
                Contact
              </Link>
              <Link
                href="/app"
                className="rounded-lg px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                Open the app
              </Link>
            </div>

            {/* Mobile navigation (only shows CTA) */}
            <div className="sm:hidden">
              <Link
                href="/app"
                className="rounded-md px-3 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                Open
              </Link>
            </div>
          </nav>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* ===== FOOTER ===== */}
        <footer className="mx-auto max-w-6xl px-4 py-12 text-sm text-zinc-400 border-t border-zinc-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} Moral Clarity AI</span>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-zinc-300">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-zinc-300">
                Terms
              </Link>
              <Link href="/status" className="hover:text-zinc-300">
                Status
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
