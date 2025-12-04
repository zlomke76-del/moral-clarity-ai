// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import NeuralSidebar from "@/app/components/NeuralSidebar";

import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moralclarity.ai"),
  title: { default: "Moral Clarity AI", template: "%s • Moral Clarity AI" },
  description: "Anchored answers. Neutral • Guidance • Ministry.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // FIX: Next.js 16 requires awaiting headers()
  const h = await headers();
  const pathname = h.get("x-pathname") || "";

  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-in");

  const isStudioRoute =
    pathname.startsWith("/w/") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/app");

  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* Background layers */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>
          {isAuthRoute ? (
            /* AUTH PAGE WRAPPER */
            <div className="z-auth min-h-screen flex items-center justify-center">
              {children}
            </div>
          ) : (
            /* MAIN APP LAYOUT */
            <div className="mc-shell">
              <aside className="mc-sidebar">
                <NeuralSidebar />
              </aside>

              <main className="mc-panel">{children}</main>
            </div>
          )}

          {/* GLOBAL OVERLAYS */}
          <div className="mc-ui">
            {!isAuthRoute && (
              <Suspense>
                <SolaceGuard />
              </Suspense>
            )}

            <Suspense>
              <Toaster />
            </Suspense>

            <SpeedInsights />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}



