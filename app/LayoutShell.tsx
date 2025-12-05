// app/LayoutShell.tsx
"use client";

import NeuralSidebar from "@/components/NeuralSidebar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="neural-sidebar">
        <NeuralSidebar />
      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


