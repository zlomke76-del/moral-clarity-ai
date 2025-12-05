"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "@/components/NeuralSidebar";
import SolaceDock from "@/components/SolaceDock";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Identify auth routes
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar always shown */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {isAuth ? (
          // ✔ Auth pages get NO padding and NO content wrapper
          <div className="w-full flex justify-center">
            {children}
          </div>
        ) : (
          // ✔ Normal pages get the standard container
          <div className="w-full max-w-3xl mx-auto px-6 py-12">
            {children}
          </div>
        )}
      </main>

      {/* Solace only on non-auth pages */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}
