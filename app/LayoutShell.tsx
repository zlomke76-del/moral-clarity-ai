"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "";

  // AUTH routes — hide Solace + sidebar
  const isAuth =
    path.startsWith("/auth") ||
    path.startsWith("/login") ||
    path.startsWith("/sign-in");

  // NEW — Sidebar ONLY for root "/" and "/app"
  const showSidebar = path === "/" || path === "/app";

  return (
    <>
      {/* --- WITH SIDEBAR (ONLY on "/" and "/app") ------------------------ */}
      {showSidebar && !isAuth && (
        <div className="grid grid-cols-[20vw_1fr] min-h-screen relative z-10">
          <aside className="h-full">
            <NeuralSidebar />
          </aside>

          <main className="h-full flex flex-col items-start justify-start">
            <div className="w-full max-w-3xl px-8 py-16">{children}</div>
          </main>
        </div>
      )}

      {/* --- WITHOUT SIDEBAR (all other routes) --------------------------- */}
      {!showSidebar && (
        <main className="min-h-screen w-full flex flex-col items-center justify-start pt-24 px-8">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      )}

      {/* --- SOLACE Dock (hidden only on auth pages) ---------------------- */}
      {!isAuth && (
        <div className="mc-ui">
          <Suspense>
            <SolaceGuard />
          </Suspense>
          <SpeedInsights />
        </div>
      )}
    </>
  );
}

