"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // Sidebar stays ALWAYS.
  // Solace is the only thing we optionally hide on auth pages.
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* ---------------------------
          LEFT SIDEBAR - ALWAYS SHOWN
      ---------------------------- */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* ---------------------------
          MAIN CONTENT AREA
      ---------------------------- */}
      <main className="flex-1 overflow-y-auto flex">
        {/* AUTH PAGES USE THIS WRAPPER:
            - Centered
            - Tight layout
            - No giant full-screen width stretch */}
        {isAuth ? (
          <div className="flex-1 flex items-center justify-center px-6 py-24">
            <div className="w-full max-w-md">{children}</div>
          </div>
        ) : (
          // STANDARD PAGES
          <div className="w-full max-w-3xl mx-auto px-6 py-12">
            {children}
          </div>
        )}
      </main>

      {/* ---------------------------
          SOLACE (hidden on auth pages)
      ---------------------------- */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

