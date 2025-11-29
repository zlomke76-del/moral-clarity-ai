// app/app/layout.tsx

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

/**
 * Workspace shell for /app routes.
 *
 * - Left: NeuralSidebar (desktop only; CSS handles hide/show).
 * - Right: main Solace workspace area.
 * - Global providers + SolaceDock still come from app/layout.tsx.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Workspace navigation rail */}
      <NeuralSidebar />

      {/* Main content area (Solace workspace lives here) */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
