"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        grid
        grid-cols-[20vw_1fr]   /* Sidebar = 20% — Main = remaining */
        min-h-screen
        relative
        z-10
      "
    >
      {/* LEFT COLUMN — Sidebar */}
      <aside className="h-full">
        <NeuralSidebar />
      </aside>

      {/* RIGHT COLUMN — Main Page Content */}
      <main className="h-full flex flex-col items-start justify-start">
        {/* This wrapper prevents pages from “nesting” additional shells */}
        <div className="w-full max-w-2xl px-8 py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
