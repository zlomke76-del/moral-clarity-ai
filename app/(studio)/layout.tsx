"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-shell" style={{ display: "flex", height: "100vh" }}>
      <NeuralSidebar />

      <div style={{ flex: 1, position: "relative" }}>
        {children}
      </div>

      <SolaceDock />
    </div>
  );
}
