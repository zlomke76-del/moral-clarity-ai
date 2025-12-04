// lib/memory-server.ts

// No generics on supabase.from() to avoid versioned TS signature conflicts.

import { supabaseServer } from "@/lib/supabase";

export type MemoryHit = {
  id?: string;
  user_key?: string;
  workspace_id?: string;
  title?: string;
  content?: string;
  created_at?: string;
};

export async function fetchRecentMemories(workspaceId: string, limit = 50) {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .schema("mca")
    .from("memories")
    .select("id, user_key, workspace_id, title, content, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Memory fetch error:", error);
    return [];
  }

  return Array.isArray(data) ? (data as MemoryHit[]) : [];
}

export async function fetchMemoryById(id: string) {
  const sb = await supabaseServer();

  const { data, error } = await sb
    .schema("mca")
    .from("memories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Memory fetch single error:", error);
    return null;
  }

  return data as MemoryHit | null;
}
