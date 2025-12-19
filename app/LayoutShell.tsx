// app/LayoutShell.tsx
"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LayoutDebugOverlay from "@/app/components/LayoutDebugOverlay";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  const isApp =
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname.startsWith("/w/"); // workspace routes included

  const isAuth = pathname.startsWith("/auth");
  const isNewsroom =
    pathname === "/newsroom" || pathname.startsWith("/newsroom/");

  return (
    <>
      {/* Mount Solace only where allowed */}
      {!isAuth && !isNewsroom && (
        <Suspense fallback={null}>
          <SolaceGuard />
        </Suspense>
      )}

      {isApp ? (
        <div
          data-app-shell
          className="grid grid-cols-[20vw_1fr] min-h-screen relative z-10"
        >
          <aside data-neural-sidebar className="h-full">
            <NeuralSidebar />
          </aside>

          <main
            data-app-main
            className="h-full flex flex-col items-start justify-start"
          >
            <div
              data-layout-boundary="AppContentColumn"
              className="w-full max-w-3xl px-8 py-16"
            >
              {children}
            </div>
          </main>
        </div>
      ) : (
        <main
          data-standalone
          className="min-h-screen w-full flex flex-col items-center justify-start px-6 py-16"
        >
          {children}
        </main>
      )}

      {/* Always-on visual diagnostics */}
      <LayoutDebugOverlay />

      <SpeedInsights />
    </>
  );
}
