// lib/memory-local.ts
export const runtime = "nodejs";

import { supabaseNode } from "@/lib/supabase/node";

export async function listMemories(workspaceId: string) {
  const { data, error } = await supabaseNode
    .from("user_memories")
    .select("id, title, content, created_at, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(100);

  return { rows: Array.isArray(data) ? data : [], error };
}

export async function getMemory(id: string) {
  const { data, error } = await supabaseNode
    .from("user_memories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { row: data ?? null, error };
}

export async function deleteMemory(id: string) {
  const { error } = await supabaseNode
    .from("user_memories")
    .delete()
    .eq("id", id);

  return { error };
}
