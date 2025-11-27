// app/app/page.tsx
"use client";

import SolaceDock from "@/app/components/SolaceDock";
import NeuralShell from "@/app/components/NeuralShell";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function AppHome() {
  return (
    <NeuralShell>
      <div className="flex min-h-screen items-stretch">
        {/* Left: Neural sidebar (chip-style cards) */}
        <NeuralSidebar />

        {/* Right: main Solace workstation area */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <SolaceDock />
        </main>
      </div>
    </NeuralShell>
  );
}
