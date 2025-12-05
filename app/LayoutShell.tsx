"use client";

import React from "react";
import { usePathname } from "next/navigation";

// FIXED — use RELATIVE PATHS so Vercel cannot break it
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      <main className="flex-1 overflow-y-auto">
        {isAuth ? (
          <div className="w-full flex justify-center">{children}</div>
        ) : (
          <div className="w-full max-w-3xl mx-auto px-6 py-12">{children}</div>
        )}
      </main>

      {!isAuth && <SolaceDock />}
    </div>
  );
}
