"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "";

  /** AUTH PAGES — no sidebar, no Solace */
  const isAuth =
    path.startsWith("/auth") ||
    path.startsWith("/login") ||
    path.startsWith("/sign-in");

  /** ROUTES THAT SHOULD SHOW THE SIDEBAR */
  const sidebarRoutes = ["/", "/app", "/account", "/newsroom", "/w"];

  const showSidebar = sidebarRoutes.some((prefix) =>
    path === prefix || path.startsWith(prefix + "/")
  );

  return (
    <>
      {/* --- WITH SIDEBAR ------------------------------------------------ */}
      {showSidebar && !isAuth && (
        <div className="grid grid-cols-[20vw_1fr] min-h-screen relative z-10">
          {/* LEFT SIDEBAR */}
          <aside className="h-full">
            <NeuralSidebar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="h-full flex flex-col items-start justify-start">
            <div className="w-full max-w-3xl px-8 py-16">{children}</div>
          </main>
        </div>
      )}

      {/* --- WITHOUT SIDEBAR (auth, public) ----------------------------- */}
      {!showSidebar && (
        <main className="min-h-screen w-full flex flex-col items-center justify-start pt-24 px-8">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      )}

      {/* --- SOLACE (hidden only on auth pages) -------------------------- */}
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

