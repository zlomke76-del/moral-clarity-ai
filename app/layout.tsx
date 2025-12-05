// app/layout.tsx
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthPage =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/auth");

  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        {/* Background Layers */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>
          {/* 🚨 If on /auth/* → DO NOT WRAP IN SIDEBAR / FLEX SHELL */}
          {isAuthPage ? (
            <main className="auth-shell">{children}</main>
          ) : (
            <div className="flex h-screen w-screen overflow-hidden">
              {/* Sidebar */}
              <aside>
                <NeuralSidebar />
              </aside>

              {/* Workspace Content */}
              <main className="flex-1 overflow-y-auto">
                <div className="mc-content">{children}</div>
              </main>
            </div>
          )}

          {/* UI Overlays */}
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


