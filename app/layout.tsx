"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">
        {/* Background layers */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        {/* ===== REAL PAGE LAYOUT ===== */}
        <div className="flex h-screen w-screen overflow-hidden">
          
          {/* SIDEBAR */}
          <aside className="w-64 border-r border-neutral-800 bg-neutral-900/40">
            <NeuralSidebar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 relative overflow-y-auto">
            {children}
          </main>
        </div>

        {/* Solace + UI overlays */}
        <div className="mc-ui" />
      </body>
    </html>
  );
}

