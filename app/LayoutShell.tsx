"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Correct relative imports
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar always present */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {isAuth ? (
          /* AUTH PAGES */
          <div className="w-full max-w-md mx-auto mt-24 mb-32 px-6">
            {children}
          </div>
        ) : (
          /* REGULAR WORKSPACE */
          <div className="w-full max-w-3xl mx-auto px-6 py-12">
            {children}
          </div>
        )}
      </main>

      {/* Solace disabled on auth pages */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

