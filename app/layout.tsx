// app/layout.tsx
"use client";

import "./globals.css";
import type { ReactNode } from "react";

import AuthProvider from "@/components/AuthProvider";
import Toaster from "@/components/Toaster";
import SolaceGuard from "@/app/components/SolaceGuard";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="mc-root">

        {/* BACKGROUND LAYERS */}
        <div className="mc-bg" />
        <div className="mc-noise" />

        <AuthProvider>

          {/* GLOBAL SHELL */}
          <div className="flex h-screen w-screen overflow-hidden">

            {/* LEFT SIDEBAR */}
            <aside className="w-64 border-r border-neutral-800 bg-neutral-900/40 z-20">
              <NeuralSidebar />
            </aside>

            {/* MAIN WORKSPACE */}
            <main className="flex-1 relative overflow-hidden">
              <div className="h-full w-full overflow-y-auto">
                {children}
              </div>
            </main>
          </div>

          {/* UI OVERLAYS (Solace, Toaster) */}
          <div className="mc-ui">
            <SolaceGuard />
            <Toaster />
          </div>

        </AuthProvider>
      </body>
    </html>
  );
}


