// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import DemoBadge from "@/components/DemoBadge";
import dynamic from "next/dynamic";

// Mount Solace once, client-only
const SolaceDock = dynamic(() => import("@/app/components/SolaceDock"), { ssr: false });

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
  icons: {
    icon: "/MoralClarityAI_QuietDepth_Logos/icon-180.png",
    apple: "/MoralClarityAI_QuietDepth_Logos/icon-180.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* ===== HEADER ===== */}
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/MoralClarityAI_QuietDepth_Logos/icon-180.png"
                  alt="Moral Clarity AI"
                  width={24}
                  height={24}
                  priority
                  className="rounded"
                />
                <span className="brand font-semibold leading-none tracking-tight">
                  Moral Clarity AI
                </span>
              </Link>
              <DemoBadge />
            </div>

            <div className="hidden sm:flex items-center gap-6 text-sm">
              <Link href="/pricing" className="hover:opacity-80 leading-none">
                Pricing
              </Link>
              <Link href="/docs" className="hover:opacity-80 leading-none">
                Docs
              </Link>
              <Link href="/contact" className="hover:opacity-80 leading-none">
                Contact
              </Link>
              <Link
                href="/app"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Open the app
              </Link>
            </div>

            <div className="sm:hidden">
              <Link
                href="/app"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Open
              </Link>
            </div>
          </nav>
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        {/* Floating Solace (singleton) */}
        <SolaceDock />

        {/* ===== FOOTER ===== */}
        <footer className="mx-auto max-w-6xl border-t border-zinc-800 px-4 py-12 text-sm text-zinc-400">
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

