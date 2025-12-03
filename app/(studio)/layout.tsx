// app/(studio)/layout.tsx
"use client";

import type { ReactNode } from "react";

// Correct paths — these files are under /app/components
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <NeuralSidebar />

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Solace floating dock */}
      <SolaceDock />
    </div>
  );
}
