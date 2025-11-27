// app/app/page.tsx
"use client";

import SolaceDock from "@/app/components/SolaceDock";
import NeuralShell from "@/app/components/NeuralShell";

export default function AppHome() {
  return (
    <NeuralShell>
      <div className="flex min-h-screen items-center justify-center">
        <SolaceDock />
      </div>
    </NeuralShell>
  );
}
