// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import NextDynamic from "next/dynamic"; // avoid clash with `export const dynamic`
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import TopNav from "@/components/TopNav";
import Breadcrumb from "@/components/Breadcrumb";
import DemoBadge from "@/components/DemoBadge";
import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";

// ----- Route segment config -----
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

// SolaceDock lives under /app/components
const SolaceDock = NextDynamic(() => import("@/app/components/SolaceDock"), {
  ssr: false,
});

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

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full" data-skin="glass">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased flex flex-col">
        <AuthProvider>
          {/* ===== HEADER ===== */}
          <header className="sticky top-0 z-50 border-b border-neutral-900 bg-gradient-to-b from-black/90 via-neutral-950/90 to-neutral-950/80 backdrop-blur">
            <nav className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2 sm:h-14 sm:py-0 w-full max-w-7xl">
              {/* Left: logo + product tag */}
              <div className="flex min-w-0 items-center gap-2">
                <Link
                  href="/app"
                  className="flex items-center gap-2"
                  prefetch
                >
                  <Image
                    src="/MoralClarityAI_QuietDepth_Logos/icon-180.png"
                    alt="Moral Clarity AI"
                    width={26}
                    height={26}
                    priority
                    className="rounded-md shadow-sm"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold tracking-tight truncate max-w-[160px] sm:max-w-none">
                      Moral Clarity AI
                    </span>
                    <span className="hidden text-[11px] text-neutral-400 sm:block">
                      MCAI Studio • Neural workspaces
                    </span>
                  </div>
                </Link>
                <span className="hidden sm:inline-flex">
                  <DemoBadge />
                </span>
              </div>

              {/* Right: Workspaces + Magic key */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <Link
                  href="/app"
                  className="rounded-md border border-neutral-700/80 bg-neutral-900/60 px-3 py-1.5 font-medium text-neutral-100 shadow-sm hover:border-neutral-400 hover:bg-neutral-900 transition"
                  prefetch
                >
                  Workspaces
                </Link>
                <Link
                  href="/magic-key"
                  className="rounded-md bg-amber-400/90 px-3.5 py-1.5 font-semibold text-neutral-950 shadow-sm hover:bg-amber-300 transition"
                  prefetch={false}
                >
                  Get magic key
                </Link>
              </div>
            </nav>

            {/* Studio app sub-nav (Founder lane, etc.) */}
            <TopNav />
          </header>

          {/* ===== MAIN CONTENT ===== */}
          <main className="flex-1 w-full">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-4">
              <div id="breadcrumb-slot">
                <Breadcrumb items={[]} />
              </div>
              {children}
            </div>
          </main>

          {/* ===== GLOBAL FLOATING COMPONENTS ===== */}
          <Suspense>
            <SolaceDock />
          </Suspense>
          <Suspense>
            <Toaster />
          </Suspense>

          {/* Vercel Speed Insights */}
          <SpeedInsights />

          {/* ===== FOOTER ===== */}
          <footer className="mx-auto w-full max-w-7xl border-t border-neutral-900 px-4 py-10 text-xs sm:text-sm text-neutral-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} Moral Clarity AI</span>
              <div className="flex flex-wrap gap-5">
                <Link
                  href="/privacy"
                  className="hover:text-neutral-300"
                  prefetch
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-neutral-300"
                  prefetch
                >
                  Terms
                </Link>
                <Link
                  href="/status"
                  className="hover:text-neutral-300"
                  prefetch={false}
                >
                  Status
                </Link>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

