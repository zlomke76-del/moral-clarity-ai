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

  // You are NOT removing the sidebar on auth pages.
  // This is only to disable Solace if you want.
  const isAuth = pathname.startsWith("/auth");

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar ALWAYS visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {/* Wrapper controls centering & max-width */}
        <div className="w-full flex flex-col items-center justify-start px-6 py-24">
          {children}
        </div>
      </main>

      {/* Solace (optional on auth) */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

