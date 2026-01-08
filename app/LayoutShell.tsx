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
   * - Sidebar
   * - Grid layout
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
          className="grid grid-cols-[minmax(280px,20vw)_1fr]
                     h-screen min-h-0 relative z-10"
        >
          {/* SIDEBAR — fixed column */}
          <aside
            data-neural-sidebar
            className="h-full overflow-y-auto
                       border-r border-neutral-800
                       bg-neutral-950/60 backdrop-blur-xl"
          >
            <NeuralSidebar />
          </aside>

          {/* MAIN COLUMN */}
          <main
            data-app-main
            className="h-full min-h-0
                       flex flex-col
                       items-start justify-start
                       overflow-hidden"
          >
            <div
              data-app-content
              className={
                isWorkspace
                  ? // TOOL / WORKSPACE MODE
                    "w-full h-full min-h-0 flex flex-col overflow-hidden px-0 py-0"
                  : // NORMAL APP CONTENT
                    "w-full h-full min-h-0 px-10 py-12 overflow-hidden"
              }
            >
              {children}
            </div>
          </main>
        </div>
      ) : (
        /**
         * STANDALONE MODE
         * Marketing / auth / public
         */
        <main
          data-standalone
          className="min-h-screen w-full
                     flex flex-col
                     items-center justify-start
                     px-6 py-16"
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
