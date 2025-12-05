"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        grid
        grid-cols-[20vw_1fr]
        min-h-screen
        relative
        z-10
      "
    >
      {/* Sidebar (20vw) */}
      <aside className="h-full">
        <NeuralSidebar />
      </aside>

      {/* Main column (80%) */}
      <main className="h-full flex flex-col justify-start items-start px-12 py-16">
        {children}
      </main>
    </div>
  );
}
