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
      {isAuthPage ? (
        // AUTH LAYOUT — NO SOLACE UI
        <div className="flex h-screen w-screen overflow-hidden">
          <aside>
            <NeuralSidebar />
          </aside>

          <main className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
            {children}
          </main>
        </div>
      ) : (
        // NORMAL WORKSPACE LAYOUT
        <div className="flex h-screen w-screen overflow-hidden">
          <aside>
            <NeuralSidebar />
          </aside>

          <main className="flex-1 overflow-y-auto">
            <div className="mc-content">{children}</div>
          </main>
        </div>
      )}

      {/* ⭐ ABSOLUTELY BLOCK SOLACE UI ON AUTH */}
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

