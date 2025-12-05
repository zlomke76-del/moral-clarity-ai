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
  const isAuth = pathname.startsWith("/auth");

  // Sidebar is ALWAYS present.
  // Only the main content layout changes for auth vs non-auth.
  if (isAuth) {
    return (
      <div className="relative z-10 min-h-screen flex">
        <aside className="shrink-0">
          <NeuralSidebar />
        </aside>

        <main className="flex-1 flex items-center justify-center px-6 py-24 overflow-y-auto">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
        {/* No Solace on auth pages */}
      </div>
    );
  }

  // Normal (non-auth) pages
  return (
    <div className="relative z-10 min-h-screen flex">
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      <SolaceDock />
    </div>
  );
}


