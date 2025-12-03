// app/(studio)/page.tsx
"use client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import NeuralSidebar from "@/app/components/NeuralSidebar";
import SolaceDock from "@/app/components/SolaceDock";



export default function StudioHome() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="w-[260px] border-r border-neutral-800 bg-neutral-950">
        <NeuralSidebar />
      </div>

      {/* Main content area with Solace */}
      <div className="flex-1 relative">
        <SolaceDock />
      </div>
    </div>
  );
}
