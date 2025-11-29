"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";
import SolaceDock from "@/app/components/SolaceDock";

type WorkspaceLayoutProps = {
  children: ReactNode;
  params: { workspaceId: string };
};

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <SupabaseSessionProvider>
      {/* 2-column grid: left = NeuralSidebar, right = page content */}
      <div className="min-h-screen grid grid-cols-[20rem_minmax(0,1fr)]">
        {/* LEFT: sidebar */}
        <NeuralSidebar />

        {/* RIGHT: main workspace area */}
        <div className="relative min-h-screen">
          {/* Page content (Memory, Newsroom, etc.) always starts at the top */}
          <main className="min-h-screen px-8 py-10">
            {children}
          </main>

          {/* Solace dock floats above content, does NOT push anything down */}
          <SolaceDock />
        </div>
      </div>
    </SupabaseSessionProvider>
  );
}
