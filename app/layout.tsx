import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdr = headers();
  const pathname = hdr.get("x-pathname") || "";

  /** 
   * Determine which routes should show SolaceShell UI.
   * - NO Solace on root ("/")
   * - NO Solace on auth routes
   * - Solace ONLY on pages inside /app or /w/*
   */
  const isAuthRoute =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/password");

  const isHome = pathname === "/" || pathname === "/app";

  const showSolace = !isAuthRoute && !isHome;

  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* Global Cinematic Background */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>
          {/* MAIN 2-COLUMN APP SHELL */}
          <div className="mc-shell">
            {/* Sidebar ALWAYS visible */}
            <NeuralSidebar />

            {/* Primary Page Content */}
            <main className="mc-content">{children}</main>
          </div>

          {/* SOLACE + TOAST ONLY WHEN ALLOWED */}
          {showSolace && (
            <div className="mc-ui">
              <Suspense>
                <SolaceGuard />
              </Suspense>

              <Suspense>
                <Toaster />
              </Suspense>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}



