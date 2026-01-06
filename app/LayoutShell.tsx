"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import LayoutDebugOverlay from "@/app/components/LayoutDebugOverlay";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  /**
   * APP SHELL ROUTES
   * These routes get:
   * - Sidebar (20%)
   * - Grid layout
   * - App padding
   */
 const isApp =
  pathname === "/app" ||
  pathname.startsWith("/app/");

  /**
   * Workspace pages get zero padding
   */
  const isWorkspace = pathname.startsWith("/w/");

  return (
    <>
      {isApp ? (
        <div
          data-app-shell
          className="grid grid-cols-[minmax(280px,20vw)_1fr] min-h-screen relative z-10"
        >
          {/* SIDEBAR — fixed 20% */}
          <aside
            data-neural-sidebar
            className="h-screen overflow-y-auto border-r border-neutral-800 bg-neutral-950/60 backdrop-blur-xl"
          >
            <NeuralSidebar />
          </aside>

          {/* MAIN CONTENT — 80% */}
          <main
            data-app-main
            className="h-full flex flex-col items-start justify-start"
          >
            <div
              data-app-content
              className={
                isWorkspace
                  ? "w-full h-full px-0 py-0"
                  : "w-full px-10 py-12"
              }
            >
              {children}
            </div>
          </main>
        </div>
      ) : (
        /**
         * STANDALONE MODE
         * Used for:
         * - Auth pages
         * - Marketing pages
         * - Public content
         */
        <main
          data-standalone
          className="min-h-screen w-full flex flex-col items-center justify-start px-6 py-16"
        >
          {children}
        </main>
      )}

      {/* Debug overlay always last */}
      <LayoutDebugOverlay />

      <SpeedInsights />
    </>
  );
}
