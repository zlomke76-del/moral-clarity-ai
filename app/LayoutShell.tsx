"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        grid
        grid-cols-[20vw_1fr]   /* COL1 = 20% viewport width, COL2 = remaining space */
        min-h-screen
        relative
        z-10
      "
    >
      {/* COLUMN 1 — Sidebar */}
      <aside className="h-full">
        <NeuralSidebar />
      </aside>

      {/* COLUMN 2 — Main Content */}
      <main className="h-full flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl px-8 py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
