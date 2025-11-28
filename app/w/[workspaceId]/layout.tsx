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
  // We don’t actually need workspaceId inside the layout yet,
  // but we keep it here in case you want to add workspace-specific
  // UI later.
  const { workspaceId } = params;

  return (
    <SupabaseSessionProvider>
      <div className="min-h-screen flex bg-slate-950">
        {/* Left navigation */}
        <NeuralSidebar />

        {/* Main content area */}
        <main className="flex-1 flex flex-col items-stretch justify-start">
          {children}
        </main>
      </div>
    </SupabaseSessionProvider>
  );
}
