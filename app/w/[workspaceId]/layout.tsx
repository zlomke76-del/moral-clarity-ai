// app/w/[workspaceId]/layout.tsx
"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <SupabaseSessionProvider>
      {/* 👇 This is your flex parent: sidebar + main content */}
      <div className="min-h-screen flex bg-[#020617]">
        <NeuralSidebar />

        <main className="flex-1 flex flex-col items-stretch justify-start">
          {children}
        </main>
      </div>
    </SupabaseSessionProvider>
  );
}

