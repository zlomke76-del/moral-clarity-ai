// app/LayoutShell.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Use RELATIVE imports because of your import map behavior
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Auth routes: keep sidebar, just hide Solace
  const isAuth = pathname?.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Left Sidebar — always present */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Solace overlay — disabled on auth pages */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}
