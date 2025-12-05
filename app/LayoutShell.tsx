// app/LayoutShell.tsx
"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen flex">
      {/* LEFT SIDEBAR */}
      <aside className="shrink-0">
        <NeuralSidebar />
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-md px-6 py-24">
          {children}
        </div>
      </main>
    </div>
  );
}

