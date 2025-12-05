"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar always visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* MAIN CONTENT — FIXED STRUCTURE */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className={`px-6 py-24 w-full ${isAuth ? "flex items-center justify-center" : ""}`}>
          {children}
        </div>
      </main>

      {/* Solace only hidden on auth */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

