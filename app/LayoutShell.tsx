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

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar ALWAYS visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area — FIXED so auth pages center correctly */}
      <main className="flex-1 overflow-y-auto flex">
        {/* When auth: center vertically + horizontally
            When normal: standard app layout */}
        <div
          className={
            isAuth
              ? "flex flex-col items-center justify-center w-full px-6 py-24"
              : "w-full max-w-3xl mx-auto px-6 py-12"
          }
        >
          {children}
        </div>
      </main>

      {/* Solace always visible, sidebar always visible */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

