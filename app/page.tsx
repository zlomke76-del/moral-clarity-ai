// app/page.tsx
"use client";

import NeuralShell from "./components/NeuralShell";
import NeuralSidebar from "./components/NeuralSidebar";
import SolaceDock from "./components/SolaceDock";

/**
 * Root page for studio.moralclarity.ai/
 * This loads the Solace workstation (sidebar + dock)
 * wrapped inside NeuralShell which handles the full backdrop.
 */
export default function HomePage() {
  return (
    <NeuralShell>
      <div className="flex min-h-screen items-stretch w-full">
        
        {/* Left Sidebar */}
        <NeuralSidebar />

        {/* Main Solace Workspace */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <SolaceDock />
        </main>
      </div>
    </NeuralShell>
  );
}
