"use client";

import type { ReactNode } from "react";
import NeuralSidebar from "@/app/components/NeuralSidebar";
import { SupabaseSessionProvider } from "@/app/providers/supabase-session";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SupabaseSessionProvider>
      <div className="min-h-screen grid grid-cols-[20rem_1fr]">
        {/* LEFT SIDEBAR */}
        <NeuralSidebar />

        {/* MAIN CONTENT */}
        <div className="relative w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </SupabaseSessionProvider>
  );
}
