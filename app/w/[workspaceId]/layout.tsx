// app/w/[workspaceId]/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";
import SolaceDock from "@/app/components/SolaceDock";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <SupabaseSessionProvider>
      <div className="min-h-screen bg-[#020617] grid grid-cols-[20rem_1fr] relative">
        {/* Sidebar (fixed width) */}
        <NeuralSidebar />

        {/* Main content (takes remaining space) */}
        <main className="w-full h-full px-10 py-10 overflow-y-auto">
          {children}
        </main>

        {/* Solace Dock */}
        <SolaceDock />
      </div>
    </SupabaseSessionProvider>
  );
}
