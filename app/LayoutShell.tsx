"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAuth = pathname.startsWith("/auth");

  return (
<div className="relative z-10 flex">
      {/* Sidebar always visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content — remove forced scroll when on auth pages */}
      <main className={`flex-1 ${isAuth ? "" : "overflow-y-auto"}`}>
        <div className="w-full flex flex-col items-center justify-center px-6 py-24">
          {children}
        </div>
      </main>

      {/* Solace hidden on auth */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

