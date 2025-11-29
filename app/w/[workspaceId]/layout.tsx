// app/w/[workspaceId]/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-row">
      {/* Left Sidebar */}
      <NeuralSidebar />

      {/* Main Content */}
      <main className="flex-1 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
