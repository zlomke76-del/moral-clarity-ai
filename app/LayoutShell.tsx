// app/LayoutShell.tsx
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceGuard from "@/app/components/SolaceGuard";
import Toaster from "@/components/Toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname() ?? "";
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <>
      {/* Shared shell: sidebar is ALWAYS present */}
      <div className="flex h-screen w-screen overflow-hidden">
        <aside>
          <NeuralSidebar />
        </aside>

        {isAuthPage ? (
          // AUTH LAYOUT: sidebar + centered auth form, NO Solace
          <main className="flex-1 overflow-y-auto auth-main">
            <div className="auth-container">{children}</div>
          </main>
        ) : (
          // NORMAL WORKSPACE LAYOUT
          <main className="flex-1 overflow-y-auto">
            <div className="mc-content">{children}</div>
          </main>
        )}
      </div>

      {/* Block Solace UI on auth routes */}
      {!isAuthPage && (
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


