// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import NeuralSidebar from "@/app/components/NeuralSidebar";

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
  /* Detect auth routes for hiding sidebar */
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isAuth = pathname.startsWith("/auth");

  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* Background layers */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>

          {/* 
            MAIN APP SHELL
            Sidebar appears only when NOT on /auth pages.
          */}
          <div className="mc-shell">
            {!isAuth && (
              <aside className="mc-sidebar">
                <NeuralSidebar />
              </aside>
            )}

            <main className="mc-content">
              {children}
            </main>
          </div>

          {/* Global overlays */}
          <div className="mc-ui">
            <Suspense>
              <SolaceGuard />
            </Suspense>

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



