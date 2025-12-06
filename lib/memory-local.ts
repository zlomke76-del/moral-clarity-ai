// lib/memory-local.ts
// Server utilities for reading workspace memories

import { supabaseServer } from "@/lib/supabase/server";

export async function listMemories(workspaceId: string) {
  // MUST CALL supabaseServer()
  const sb = await supabaseServer();

  const { data, error } = await sb
    .from("user_memories")
    .select("id, title, content, created_at, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(100);

  return {
    rows: Array.isArray(data) ? data : [],
    error,
  };
}

export async function getMemory(id: string) {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .from("user_memories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { row: data ?? null, error };
}

export async function deleteMemory(id: string) {
  const sb = await supabaseServer();

  const { error } = await sb
    .from("user_memories")
    .delete()
    .eq("id", id);

  return { error };
}
