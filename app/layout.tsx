// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import NextDynamic from "next/dynamic"; // avoid clash with `export const dynamic`
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Breadcrumb from "@/components/Breadcrumb";
import DemoBadge from "@/components/DemoBadge";
import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";

// Route segment config — keep these named exports
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
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full" data-skin="glass">
      <body className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100 antialiased">
        <AuthProvider>
          {/* ===== STUDIO HEADER (no marketing nav) ===== */}
          <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/85 backdrop-blur">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              {/* Left: logo + name + demo badge */}
              <div className="flex items-center gap-2">
                <Link href="/app" className="flex items-center gap-2" prefetch>
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

              {/* Right: magic-link login */}
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden text-xs text-neutral-400 sm:inline">
                  MCAI Studio ·{" "}
                  <span className="text-neutral-100">Founder lane</span>
                </span>
                <Link
                  href="/login"
                  prefetch
                  className="rounded-full border border-sky-400/70 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100 shadow-[0_0_18px_rgba(56,189,248,0.55)] hover:border-sky-300/80 hover:bg-sky-500/20"
                >
                  Get magic key
                </Link>
              </div>
            </nav>
          </header>

          {/* ===== MAIN CONTENT ===== */}
          <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-10">
            <div id="breadcrumb-slot">
              <Breadcrumb items={[]} />
            </div>
            {children}
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
          <footer className="mx-auto w-full max-w-6xl border-t border-neutral-800 px-4 py-12 text-sm text-neutral-400">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} Moral Clarity AI</span>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-neutral-300" prefetch>
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-neutral-300" prefetch>
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
