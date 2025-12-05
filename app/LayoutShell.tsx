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

      {/* ----------------------------------------
          SIDEBAR — ALWAYS VISIBLE ON ALL PAGES
         ---------------------------------------- */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* ----------------------------------------
          MAIN CONTENT AREA
         ---------------------------------------- */}
      <main className="flex-1 flex flex-col">
        {/* Auth pages need centered layout */}
        {isAuth ? (
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center p-12">
            {children}
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto px-6 py-12">
            {children}
          </div>
        )}
      </main>

      {/* ----------------------------------------
          SOLACE — Always shown except auth pages
         ---------------------------------------- */}
      {!isAuth && <SolaceDock />}
    </div>
  );
}

