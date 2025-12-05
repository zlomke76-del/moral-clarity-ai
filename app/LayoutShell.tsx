// app/LayoutShell.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Correct absolute paths — match your actual filesystem
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // AUTH PAGES → NO SIDEBAR, NO SOLACE, CENTERED LAYOUT
  const isAuth =
    pathname?.startsWith("/auth") ||
    pathname === "/auth" ||
    pathname === "/auth/sign-in" ||
    pathname === "/auth/callback";

  if (isAuth) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen overflow-y-auto">
        {children}
      </main>
    );
  }

  // NORMAL APP PAGES → SIDEBAR + CONTENT + SOLACE
  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Sidebar */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Solace Overlay */}
      <SolaceDock />
    </div>
  );
}
