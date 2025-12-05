"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth/");

  if (isAuthPage) {
    // AUTH PAGES → NO SIDEBAR, NO SOLACE
    return (
      <main className="min-h-screen w-full flex items-center justify-center">
        {children}
      </main>
    );
  }

  // NORMAL PAGES → SIDEBAR + SOLACE
  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        <aside>
          <NeuralSidebar />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="mc-content">{children}</div>
        </main>
      </div>

      <div className="mc-ui">
        <Suspense><SolaceGuard /></Suspense>
        <Suspense><Toaster /></Suspense>
        <SpeedInsights />
      </div>
    </>
  );
}
