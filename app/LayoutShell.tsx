// app/LayoutShell.tsx
"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
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
      {/* GRID LAYOUT — 20% SIDEBAR / 80% MAIN */}
      <div
        className="
          grid
          grid-cols-[20vw_1fr]
          min-h-screen
          relative
          z-10
        "
      >
        {/* LEFT COLUMN — Sidebar (20%) */}
        <aside className="h-full">
          <NeuralSidebar />
        </aside>

        {/* RIGHT COLUMN — Main Page Content (80%) */}
        <main className="h-full flex flex-col items-start justify-start">
          {/* This wrapper keeps each page's content in the right 80% */}
          <div className="w-full max-w-2xl px-8 py-16">
            {children}
          </div>
        </main>
      </div>

      {/* SOLACE — ONLY ON NON-AUTH ROUTES */}
      {!isAuthPage && (
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
