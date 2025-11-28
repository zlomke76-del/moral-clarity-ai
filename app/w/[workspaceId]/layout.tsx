// app/w/[workspaceId]/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) {
  const { workspaceId } = params; // kept for future workspace-specific UI

  return (
    <SupabaseSessionProvider>
      <div className="min-h-screen flex bg-[#020617]">
        {/* Left navigation */}
        <NeuralSidebar />

        {/* Main content area */}
        <main
          className="
            flex-1 min-h-screen
            flex flex-col items-stretch justify-start
            bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-900
            text-slate-100
          "
        >
          {/* Inner content frame so things don’t hug the edges */}
          <div className="w-full max-w-6xl mx-auto px-6 py-10">
            {children}
          </div>
        </main>
      </div>
    </SupabaseSessionProvider>
  );
}
