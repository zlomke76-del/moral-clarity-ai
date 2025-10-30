// lib/memory-local.ts
import { createServerSupabase } from "./supabase/server";

export async function listMemories(workspaceId: string) {
  const supa = createServerSupabase();
  const { data, error } = await supa
    .schema("mca")
    .from("memories")
    .select("id, title, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getMemory(id: string) {
  const supa = createServerSupabase();
  const { data, error } = await supa
    .schema("mca")
    .from("memories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
