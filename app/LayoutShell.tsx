"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {/* AUTH PAGES — sidebar ON, Solace OFF */}
      {isAuthPage ? (
        <div className="flex h-screen w-screen overflow-hidden">
          <aside>
            <NeuralSidebar />
          </aside>

          <main className="flex-1 overflow-y-auto auth-main">
            {children}
          </main>
        </div>
      ) : (
        /* NORMAL WORKSPACE */
        <div className="flex h-screen w-screen overflow-hidden">
          <aside>
            <NeuralSidebar />
          </aside>

          <main className="flex-1 overflow-y-auto">
            <div className="mc-content">{children}</div>
          </main>
        </div>
      )}

      {/* SOLACE + TOASTER — ONLY for workspace */}
      {!isAuthPage && (
        <div className="mc-ui">
          <Suspense>
            <SolaceGuard />
          </Suspense>
          <Suspense>
            <Toaster />
          </Suspense>
          <SpeedInsights />
        </div>
      )}
    </>
  );
}

