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
  const isAuth = pathname.startsWith("/auth");

  // AUTH PAGES → do NOT wrap anything from workspace shell
  if (isAuth) {
    return <>{children}</>;
  }

  // NON-AUTH → sidebar + workspace container + Solace
  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar always visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Workspace main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      <SolaceDock />
    </div>
  );
}

