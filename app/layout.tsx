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
      {/* 
        IMPORTANT:
        - Apply mc-root so global background system activates
        - Remove the hardcoded bg-[#020617] override that broke the backdrop
      */}
      <body className="mc-root h-full">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
