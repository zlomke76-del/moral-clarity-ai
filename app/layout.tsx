"use client";

import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase/provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="mc-root h-full">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
