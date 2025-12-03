// app/studio/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/components/NeuralSidebar";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[70vh] flex gap-6 px-4 py-10">
      {/* Left: Neural sidebar */}
      <aside className="hidden md:block w-64 shrink-0">
        <NeuralSidebar />
      </aside>

      {/* Right: main studio content */}
      <section className="flex-1 relative">
        {children}
      </section>
    </div>
  );
}
