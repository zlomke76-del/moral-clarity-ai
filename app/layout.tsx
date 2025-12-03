// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import NextDynamic from "next/dynamic";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import DemoBadge from "@/components/DemoBadge";
import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

const SolaceDock = NextDynamic(
  () => import("@/app/components/SolaceDock"),
  { ssr: false }
);

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moralclarity.ai"),
  title: { default: "Moral Clarity AI", template: "%s • Moral Clarity AI" },
  description: "Anchored answers. Neutral • Guidance • Ministry.",
  icons: {
    icon: "/MoralClarityAI_QuietDepth_Logos/icon-180.png",
    apple: "/MoralClarityAI_QuietDepth_Logos/icon-180.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full" data-skin="glass">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased flex flex-col">
        <AuthProvider>

          {/* HEADER ONLY — CLEAN */}
          <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">

              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2" prefetch>
                  <Image
                    src="/MoralClarityAI_QuietDepth_Logos/icon-180.png"
                    alt="Moral Clarity AI"
                    width={24}
                    height={24}
                    priority
                    className="rounded"
                  />
                  <span className="font-semibold leading-none tracking-tight">
                    Moral Clarity AI
                  </span>
                </Link>
                <DemoBadge />
              </div>

              <div className="hidden sm:flex items-center gap-6 text-sm">
                <Link href="/pricing" className="hover:opacity-80">Pricing</Link>
                <Link href="/docs" className="hover:opacity-80">Docs</Link>
                <Link href="/contact" className="hover:opacity-80">Contact</Link>
                <Link
                  href="/app"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Open the app
                </Link>
              </div>

              <div className="sm:hidden">
                <Link
                  href="/app"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Open
                </Link>
              </div>

            </nav>
          </header>

          {/* MAIN */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
            {children}
          </main>

          {/* FLOATING COMPONENTS */}
          <Suspense><SolaceDock /></Suspense>
          <Suspense><Toaster /></Suspense>

          <SpeedInsights />

          {/* FOOTER */}
          <footer className="mx-auto w-full max-w-6xl border-t border-neutral-800 px-4 py-12 text-sm text-neutral-400">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} Moral Clarity AI</span>
              <div className="flex gap-6">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/status">Status</Link>
              </div>
            </div>
          </footer>

        </AuthProvider>
      </body>
    </html>
  );
}


