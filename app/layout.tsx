// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import LayoutShell from "./LayoutShell";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
      {/* ❗ IMPORTANT: remove min-h-screen and relative */}
      <body className="mc-root">
        {/* Global background */}
        <div className="mc-bg pointer-events-none absolute inset-0 z-0" />
        <div className="mc-noise pointer-events-none absolute inset-0 z-0" />

        {/* All actual layout happens inside LayoutShell */}
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}


