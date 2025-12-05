"use client";

import React from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen flex">
      {/* --- Sidebar (always visible) --- */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* --- Main content area --- */}
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-xl mx-auto px-6 py-24 flex flex-col items-center">
          {children}
        </div>
      </main>
    </div>
  );
}


