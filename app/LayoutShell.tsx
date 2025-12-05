// app/LayoutShell.tsx
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

  // Solace can be disabled on auth pages if you want
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar ALWAYS shows on every page */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      {/* Optional: hide Solace on auth pages */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}


