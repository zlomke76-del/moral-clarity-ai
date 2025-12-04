import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
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

        {/* Background */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>
          
          {/* DIRECT CHILDREN — NO EXTRA WRAPPING */}
          {children}

          {/* Solace + Toaster overlays */}
          <Suspense>
            <SolaceGuard />
          </Suspense>

          <Suspense>
            <Toaster />
          </Suspense>

          <SpeedInsights />

        </AuthProvider>
      </body>
    </html>
  );
}




