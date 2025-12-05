"use client";

import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuth = pathname.startsWith("/auth/");

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden">
        
        {/* Sidebar ALWAYS visible */}
        <aside>
          <NeuralSidebar />
        </aside>

        {/* Auth vs Workspace */}
        <main className={`flex-1 overflow-y-auto ${isAuth ? "auth-main" : ""}`}>
          {isAuth ? (
            <div className="auth-container">
              {children}
            </div>
          ) : (
            <div className="mc-content">{children}</div>
          )}
        </main>

      </div>

      {/* Solace UI hidden on auth */}
      {!isAuth && (
        <div className="mc-ui">
          <Suspense><SolaceGuard /></Suspense>
          <Suspense><Toaster /></Suspense>
          <SpeedInsights />
        </div>
      )}
    </>
  );
}


