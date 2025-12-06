// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import dynamic from "next/dynamic";
import AuthProvider from "@/components/AuthProvider";
import LayoutShell from "./LayoutShell";
import Toaster from "@/components/Toaster";

// ⭐ Load SolaceDock as a CLIENT COMPONENT without turning layout into "use client"
const SolaceDock = dynamic(() => import("@/app/components/SolaceDock"), {
  ssr: false,
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="mc-root min-h-screen relative">

        {/* GLOBAL BACKGROUND */}
        <div className="mc-bg absolute inset-0 pointer-events-none z-0" />
        <div className="mc-noise absolute inset-0 pointer-events-none z-0" />

        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>

          {/* ⭐ Solace restored */}
          <SolaceDock />
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}

