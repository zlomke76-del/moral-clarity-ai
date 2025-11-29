// app/app/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left workspace sidebar */}
      <NeuralSidebar />

      {/* Main content area (Solace, etc.) */}
      <main className="flex-1 flex items-stretch justify-center">
        {children}
      </main>
    </div>
  );
}
