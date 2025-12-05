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
      <div className="flex h-screen w-screen overflow-hidden">
        <NeuralSidebar />

        {isAuthPage ? (
          // ⭐ AUTH LAYOUT
          <main className="flex-1 overflow-y-auto">
            <div className="auth-container px-6 py-20 flex justify-center">
              {children}
            </div>
          </main>
        ) : (
          // ⭐ NORMAL WORKSPACE LAYOUT
          <main className="flex-1 overflow-y-auto">
            <div className="mc-content">{children}</div>
          </main>
        )}
      </div>

      {/* Hide Solace entirely during auth */}
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
