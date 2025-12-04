import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* BACKGROUND */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>

          {/* ===== MAIN APP FRAME ===== */}
          <div className="flex h-screen w-screen overflow-hidden">

            {/* LEFT: Neural Sidebar */}
            <aside className="w-64 h-full border-r border-neutral-800 bg-neutral-900/40 backdrop-blur-md z-20">
              <NeuralSidebar />
            </aside>

            {/* RIGHT: PAGE CONTENT */}
            <main className="flex-1 h-full overflow-y-auto mc-content p-6">
              {children}
            </main>

          </div>

          {/* ===== GLOBAL OVERLAYS (Solace, Toaster) ===== */}
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



