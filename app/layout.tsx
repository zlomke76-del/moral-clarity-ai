"use client";

import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase/provider";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="mc-root h-full">
        {/* ❗ REMOVE ALL EMPTY WRAP DIVS */}
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
