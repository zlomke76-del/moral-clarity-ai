// app/app/layout.tsx

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left workspace navigation */}
      <NeuralSidebar />

      {/* Main Solace workspace area */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
