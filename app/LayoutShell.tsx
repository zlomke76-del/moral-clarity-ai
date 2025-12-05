"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {/* ALWAYS SHOW SIDEBAR */}
      <div className="flex h-screen w-screen overflow-hidden">
        <aside>
          <NeuralSidebar />
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          {children}
        </main>
      </div>

      {/* HIDE SOLACE ON AUTH */}
      {!isAuthPage && (
        <div className="mc-ui">
          <Suspense><SolaceGuard /></Suspense>
          <Suspense><Toaster /></Suspense>
          <SpeedInsights />
        </div>
      )}
    </>
  );
}
