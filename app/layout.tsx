// app/layout.tsx
"use client";

import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase/provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#020617] text-gray-100 antialiased">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
