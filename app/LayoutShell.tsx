"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "/components/NeuralSidebar";
import SolaceDock from "/components/SolaceDock";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar always visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* AUTH PAGES — no workspace wrapper, no Solace */}
        {isAuth ? (
          <div className="w-full max-w-md mx-auto mt-24 mb-32 px-6">
            {children}
          </div>
        ) : (
          /* NORMAL PAGES — workspace spacing */
          <div className="w-full max-w-3xl mx-auto px-6 py-12">
            {children}
          </div>
        )}
      </main>

      {/* Solace only when NOT in /auth */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}
