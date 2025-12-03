// app/layout.tsx
"use client";

import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase/provider";
import SolaceDock from "@/app/components/SolaceDock";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="mc-root min-h-screen">
        <SupabaseProvider>
          {children}
          {/* Solace always available */}
          <SolaceDock />
        </SupabaseProvider>
      </body>
    </html>
  );
}


