"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuth = pathname.startsWith("/auth");

  return (
    <>
      {/* --------- AUTH PAGES --------- */}
      {isAuth ? (
        <div className="flex h-screen w-screen overflow-hidden">
          <aside>
            <NeuralSidebar />
          </aside>

          {/* Auth layout uses special centered logic */}
          <main className="auth-main flex-1">
            {children}
          </main>
        </div>
      ) : (
        /* --------- NORMAL WORKSPACE --------- */
        <div className="flex h-screen w-screen overflow-hidden">
          <aside>
            <NeuralSidebar />
          </aside>

          <main className="flex-1 overflow-y-auto">
            <div className="mc-content">{children}</div>
          </main>
        </div>
      )}

      {/* Solace + Toaster ONLY on workspace */}
      {!isAuth && (
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


