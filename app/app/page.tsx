// app/app/page.tsx
"use client";

import SolaceDock from "../components/SolaceDock";
import NeuralShell from "../components/NeuralShell";
import NeuralSidebar from "../components/NeuralSidebar";

/**
 * /app — primary Solace workstation
 * - NeuralShell handles the anchor background + dimming
 * - NeuralSidebar provides chip-style navigation on the left
 * - SolaceDock is the main console in the workspace area
 */
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
