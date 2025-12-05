import type { Metadata, Viewport } from "next";
import "./globals.css";

import AuthProvider from "@/components/AuthProvider";
import ClientLayout from "./ClientLayout";
import Toaster from "@/components/Toaster";

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
      <body className="mc-root min-h-screen relative">
        {/* Background */}
        <div className="mc-bg absolute inset-0 pointer-events-none z-0" />
        <div className="mc-noise absolute inset-0 pointer-events-none z-0" />

        <AuthProvider>
          {/* All client-side logic (pathname, Solace Dock suppression) moves here */}
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}


