// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import NeuralSidebar from "@/app/components/NeuralSidebar"; // ← REQUIRED

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
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* Layer 1 — Cinematic Background */}
        <div className="mc-bg" />

        {/* Layer 2 — Film Grain / Noise */}
        <div className="mc-noise" />

        <AuthProvider>
          {/* Core App Shell: Sidebar + Content Area */}
          <div className="mc-shell">
            {/* Left Sidebar (restored) */}
            <aside className="mc-sidebar">
              <NeuralSidebar />
            </aside>

            {/* Main Content */}
            <main className="mc-content">
              {children}
            </main>
          </div>

          {/* Layer 4 — Dock, Toasts, Insights */}
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


