// app/LayoutShell.tsx
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

  // ─────────────────────────────────────────────
  // Route classification
  // ─────────────────────────────────────────────
  const isAppShell = pathname === "/app" || pathname.startsWith("/app/");
  const isWorkspace = pathname.startsWith("/w/");

  // ─────────────────────────────────────────────
  // APP SHELL (with sidebar)
  // ─────────────────────────────────────────────
  if (isAppShell) {
    return (
      <>
        <div
          data-app-shell
          className="relative z-10 grid h-screen min-h-0 grid-cols-[minmax(280px,20vw)_1fr]"
        >
          <aside
            data-neural-sidebar
            className="h-full overflow-y-auto border-r border-neutral-800 bg-neutral-950/60 backdrop-blur-xl"
          >
            <NeuralSidebar />
          </aside>

          <main
            data-app-main
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            <div
              data-app-content
              className="flex h-full min-h-0 w-full flex-col overflow-hidden px-10 py-12"
            >
              {children}
            </div>
          </main>
        </div>

        <LayoutDebugOverlay />
        <SpeedInsights />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // WORKSPACE
  // ─────────────────────────────────────────────
  if (isWorkspace) {
    return (
      <>
        <div data-workspace-canvas className="h-screen w-screen overflow-hidden">
          {children}
        </div>

        <LayoutDebugOverlay />
        <SpeedInsights />
      </>
    );
  }

  // ─────────────────────────────────────────────
  // STANDALONE (marketing / auth / research)
  // Neutral wrapper: page-level routes own their own max-width, spacing,
  // cards, and composition. Avoid inherited shell/container styling here.
  // ─────────────────────────────────────────────
  return (
    <>
      <main
        data-standalone
        className="relative z-10 min-h-screen w-full overflow-x-hidden"
      >
        <div className="w-full">{children}</div>
      </main>

      <LayoutDebugOverlay />
      <SpeedInsights />
    </>
  );
}
