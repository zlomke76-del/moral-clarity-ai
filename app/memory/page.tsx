// app/memory/page.tsx
"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";
import WorkspaceMemoryPage from "@/app/components/WorkspaceMemoryPage";

export default function MemoryPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left sidebar */}
      <NeuralSidebar />

      {/* Main memory console area */}
      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <WorkspaceMemoryPage />
        </div>
      </main>
    </div>
  );
}


