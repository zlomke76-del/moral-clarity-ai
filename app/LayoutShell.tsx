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
      {/* Sidebar ALWAYS shows */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area */}
      <main
        className={
          isAuth
            ? // AUTH PAGES → Center properly within viewport, not sidebar flex
              "flex-1 flex items-center justify-center px-6 py-24 overflow-y-auto"
            : // APP PAGES → Normal scroll layout
              "flex-1 overflow-y-auto"
        }
      >
        <div className={isAuth ? "w-full max-w-md" : "w-full max-w-3xl mx-auto px-6 py-12"}>
          {children}
        </div>
      </main>

      {/* Solace hidden only on auth pages */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}
