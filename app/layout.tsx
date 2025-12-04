// app/layout.tsx
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceDockLoader from "@/components/SolaceDockLoader";

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = headers().get("x-pathname") || "";

  // Hide Solace on all auth pages
  const hideSolace = path.startsWith("/auth");

  return (
    <html lang="en" className="dark h-full" data-skin="glass">
      <body className="mc-root">
        <AuthProvider>

          {children}

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


