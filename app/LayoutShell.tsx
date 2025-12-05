// app/LayoutShell.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "@/components/NeuralSidebar";
import SolaceDock from "@/components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  return (
    <div className={`relative z-10 min-h-screen flex ${isAuth ? "auth-mode" : ""}`}>

      {/* Sidebar visible only for normal pages */}
      {!isAuth && (
        <aside className="shrink-0">
          <NeuralSidebar />
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Solace hidden on auth */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}
