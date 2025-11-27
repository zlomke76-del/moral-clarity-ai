"use client";

import SolaceDock from "../components/SolaceDock";
import NeuralShell from "../components/NeuralShell";
import NeuralSidebar from "../components/NeuralSidebar";

export default function AppHome() {
  return (
    <NeuralShell>
      <div className="flex min-h-screen items-stretch">
        <NeuralSidebar />
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <SolaceDock />
        </main>
      </div>
    </NeuralShell>
  );
}
