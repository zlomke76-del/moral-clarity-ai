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
      {/* SIDEBAR — fixed 20% */}
      <aside className="w-1/5 min-w-[240px]">
        <NeuralSidebar />
      </aside>

      {/* MAIN AREA — remaining 80% */}
      <main className="w-4/5 flex flex-col justify-start items-center">
        <div className="w-full max-w-md px-6 py-24">
          {children}
        </div>
      </main>
    </div>
  );
}
