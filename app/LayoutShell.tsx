"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Correct paths
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Any /auth/* route should NOT show Solace
  const hideSolace =
    pathname?.startsWith("/auth/") ||
    pathname === "/auth" ||
    pathname === "/auth/sign-in";

  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Left Sidebar — always visible */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main content area — centered with max width */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      {/* Solace — only on non-auth routes */}
      {!hideSolace && <SolaceDock />}
    </div>
  );
}
