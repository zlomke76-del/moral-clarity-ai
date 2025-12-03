"use client";

import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <NeuralSidebar />

      <main style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </main>

      <SolaceDock />
    </div>
  );
}
