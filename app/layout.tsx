// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { SupabaseProvider } from "@/lib/supabase/provider";

export const metadata = {
  title: "Moral Clarity Studio",
  description: "Solace • Moral Clarity AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full bg-slate-950"
    >
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
