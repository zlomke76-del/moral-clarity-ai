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
  const { workspaceId } = params;

  return (
    <SupabaseSessionProvider>
      <div className="min-h-screen flex bg-slate-950">
        <NeuralSidebar />
        <main className="flex-1 flex flex-col items-stretch justify-start">
          {children}
        </main>
      </div>
    </SupabaseSessionProvider>
  );
}
