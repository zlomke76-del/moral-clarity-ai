// app/app/page.tsx
"use client";

import SolaceDock from "../components/SolaceDock";
import NeuralShell from "../components/NeuralShell";

export default function AppHome() {
  return (
    <NeuralShell>
      <main className="flex min-h-screen items-center justify-center px-4 py-6">
        <SolaceDock />
      </main>
    </NeuralShell>
  );
}
