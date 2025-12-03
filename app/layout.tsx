// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import NextDynamic from "next/dynamic";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" data-skin="glass">
      {/* APPLY YOUR GLOBAL BACKGROUND HERE */}
      <body className="mc-root">
        <AuthProvider>

          {children}

          {/* Global overlays */}
          <Suspense>
            <SolaceDock />
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


