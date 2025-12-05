// app/LayoutShell.tsx
"use client";

import React from "react";
import NeuralSidebar from "./components/NeuralSidebar";

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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
