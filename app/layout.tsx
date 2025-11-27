// app/layout.tsx
"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import SolaceDock from "./components/SolaceDock";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSolaceDock = pathname?.startsWith("/app");

  return (
    <html lang="en">
      <body className="bg-[#020617] text-slate-50 antialiased">
        <main className="min-h-screen">{children}</main>

        {/* Only show SolaceDock inside the app routes */}
        {showSolaceDock && <SolaceDock />}
      </body>
    </html>
  );
}
