"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Correct relative paths
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // All /auth routes
  const isAuth = pathname.startsWith("/auth");

  if (isAuth) {
    // AUTH PAGES – NO SIDEBAR, NO SOLACE
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6 py-24">
          {children}
        </div>
      </div>
    );
  }

  // NORMAL APP PAGES
  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar visible on normal pages */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      {/* Solace visible on normal pages */}
      <SolaceDock />
    </div>
  );
}
