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
      <div className="min-h-screen flex bg-[#020617] relative">
        {/* Left navigation */}
        <NeuralSidebar />

        {/* Main content */}
        <main className="flex-1 flex flex-col items-stretch justify-start relative">
          {children}
        </main>

        {/* Solace Dock — global across workspace */}
        <SolaceDock />
      </div>
    </SupabaseSessionProvider>
  );
}
