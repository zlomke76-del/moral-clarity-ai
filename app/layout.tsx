// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider";
import LayoutShell from "./LayoutShell";
import Toaster from "@/components/Toaster";

// ⭐ Solace wrapper (conditionally mounted)
import SolaceDockWrapper from "@/app/components/SolaceDockWrapper";

import { headers } from "next/headers";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moralclarity.ai"),
  title: {
    default: "Moral Clarity AI",
    template: "%s • Moral Clarity AI",
  },
  description: "Anchored answers. Neutral • Guidance • Ministry.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * 🔒 INSTITUTIONAL MODE GUARD
   *
   * Root layouts run on the server.
   * In Next 16, headers() is async and must be awaited.
   */
  const hdrs = await headers();

  const pathname =
    hdrs.get("x-pathname") ||
    hdrs.get("x-invoke-path") ||
    hdrs.get("referer") ||
    "";

  const isNewsroom =
    pathname.includes("/newsroom") ||
    pathname.includes("/newsroom/");

  return (
    <html lang="en" className="h-full dark">
      <body className="mc-root min-h-screen relative">
        <div className="mc-bg absolute inset-0 pointer-events-none z-0" />
        <div className="mc-noise absolute inset-0 pointer-events-none z-0" />

        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>

          {/* 🔒 Solace is NEVER mounted in Newsroom */}
          {!isNewsroom && <SolaceDockWrapper />}
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
