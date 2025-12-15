// app/LayoutShell.tsx
"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const isApp = pathname === "/app" || pathname.startsWith("/app/");
  const isAuth = pathname.startsWith("/auth");

  return (
    <>
      {isApp ? (
        // GRID LAYOUT ONLY FOR APP ROUTES
        <div className="grid grid-cols-[20vw_1fr] min-h-screen relative z-10">
          <aside className="h-full">
            <NeuralSidebar />
          </aside>

          <main className="h-full flex flex-col items-start justify-start">
            <div className="w-full max-w-3xl px-8 py-16">{children}</div>
          </main>
        </div>
      ) : (
        // PURE CONTENT (NO SIDEBAR)
        <main className="min-h-screen w-full flex flex-col items-center justify-start px-6 py-16">
          {children}
        </main>
      )}
    </>
  );
}


