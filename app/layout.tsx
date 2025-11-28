"use client";

import "./globals.css";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseSessionProvider>
          {children}
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
