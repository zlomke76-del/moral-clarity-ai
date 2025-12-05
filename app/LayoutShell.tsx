"use client";

import React from "react";
import { usePathname } from "next/navigation";

// RELATIVE IMPORTS so Vercel cannot break them
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth") ?? false;

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar always present */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {isAuth ? (
          // Auth pages → centered form
          <div className="w-full max-w-md mx-auto mt-24 mb-32 px-6">
            {children}
          </div>
        ) : (
          // All other pages → normal content container
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
