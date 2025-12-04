// app/layout.tsx
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceDockLoader from "@/app/components/SolaceDockLoader";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

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
  // Detect the current pathname via Next headers (server-safe).
 const h = await headers();
const path = h.get("x-pathname") || "";

  // Hide Solace on authentication routes.
  const hideSolace =
    path.startsWith("/auth") ||
    path === "/auth" ||
    path.includes("/auth/");

  return (
    <html lang="en" className="dark h-full" data-skin="glass">
      <body className="mc-root">
        <AuthProvider>

          {/* Main route content */}
          {children}

          {/* Conditionally load Solace globally */}
          {!hideSolace && (
            <Suspense>
              <SolaceDockLoader />
            </Suspense>
          )}

          <Suspense>
            <Toaster />
          </Suspense>

          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}

