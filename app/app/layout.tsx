// app/app/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";
import Toaster from "@/components/Toaster";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100">

      {/* LEFT SIDEBAR */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-900/30 backdrop-blur">
        <NeuralSidebar />
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 relative overflow-hidden bg-[url('/blueprint-grid.svg')] bg-cover bg-center">
        <div className="h-full w-full overflow-y-auto p-6">
          {children}
        </div>

        {/* FLOATING COMPONENTS */}
        <SolaceDock />
        <Toaster />
      </div>
    </div>
  );
}
