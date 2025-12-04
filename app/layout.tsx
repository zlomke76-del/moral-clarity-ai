// app/layout.tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import SolaceDock from "@/app/components/SolaceDock";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root min-h-screen">
        {/* Layer 1 — Cinematic Background */}
        <div className="mc-bg" />

        {/* Layer 2 — Film Grain / Noise */}
        <div className="mc-noise" />

        <AuthProvider>
          {/* Layer 3 — App Content (whatever layout/shell you already have) */}
          <main className="mc-content">
            {children}
          </main>

          {/* Layer 4 — Global UI overlays */}
          <div className="mc-ui">
            <Suspense>
              <SolaceGuard />
            </Suspense>

            <Suspense>
              <Toaster />
            </Suspense>

            {/* Solace always available */}
            <SolaceDock />

            <SpeedInsights />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}



