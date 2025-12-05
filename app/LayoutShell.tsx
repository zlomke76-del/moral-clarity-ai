// app/LayoutShell.tsx
"use client";

import React from "react";
import NeuralSidebar from "./components/NeuralSidebar"; // ✔ FIXED: relative path
import SolaceDock from "@/app/components/SolaceDock";   // allowed (client → client)

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Solace Dock always rendered */}
      <SolaceDock />
    </div>
  );
}


