// app/w/[workspaceId]/layout.tsx
"use client";

import type { ReactNode } from "react";
import { WorkspaceShell } from "@/app/components/WorkspaceShell";
import {
  SupabaseSessionProvider,
} from "@/app/providers/supabase-session";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceId: string };
}) {
  return (
    <SupabaseSessionProvider>
      <WorkspaceShell workspaceId={params.workspaceId}>
        {children}
      </WorkspaceShell>
    </SupabaseSessionProvider>
  );
}
