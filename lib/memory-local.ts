// lib/memory-local.ts
// Local memory helpers for server-side rendering
// Updated to use supabaseServer()

import { supabaseServer } from "./supabase/server";

export async function listMemories(workspaceId: string) {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .schema("mca")
    .from("memories")
    .select("id, title, created_at, workspace_id")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Memory fetch error:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

export async function createMemory(workspaceId: string, title: string) {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .schema("mca")
    .from("memories")
    .insert({
      workspace_id: workspaceId,
      title,
    })
    .select()
    .single();

  if (error) {
    console.error("Memory create error:", error);
    return null;
  }

  return data;
}
