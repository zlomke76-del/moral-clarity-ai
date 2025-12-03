// app/(studio)/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/components/NeuralSidebar";
import SolaceDock from "@/components/SolaceDock";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-800">
        <NeuralSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Solace Dock */}
      <SolaceDock />
    </div>
  );
}
