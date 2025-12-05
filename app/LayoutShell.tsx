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
      
      {/* LEFT SIDEBAR — fixed 20% width */}
      <aside className="w-1/5 min-w-[240px]">
        <NeuralSidebar />
      </aside>

      {/* MAIN AREA — 80% width, centers its content */}
      <main className="w-4/5 flex justify-center items-start">
        <div className="w-full max-w-2xl px-8 py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
