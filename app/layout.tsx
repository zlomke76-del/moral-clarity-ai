import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";

export const metadata: Metadata = {
  title: "Moral Clarity AI",
  description: "Anchored answers. Neutral • Guidance • Ministry.",
};

export const viewport: Viewport = {
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

        {/* Background */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>

          {/* Page */}
          <div className="mc-content">
            {children}
          </div>

          {/* Solace + Toast */}
          <div className="mc-ui">
            <Suspense>
              <SolaceGuard />
            </Suspense>

            <Suspense>
              <Toaster />
            </Suspense>
          </div>

        </AuthProvider>
      </body>
    </html>
  );
}


