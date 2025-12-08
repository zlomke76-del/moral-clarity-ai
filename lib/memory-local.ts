// lib/memory-local.ts

export const runtime = "nodejs";

import { createClientServer } from "@/lib/supabase/server";

/**
 * Server-side helper to list memories for a workspace.
 * Runs under Node.js runtime (SSR), not edge.
 */
export async function listMemories(workspaceId: string) {
  const supabase = createClientServer();

  const { data, error } = await supabase
    .from("user_memories")
    .select("id, title, created_at, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[memory-local] listMemories error:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}
