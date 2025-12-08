// lib/memory-server.ts
//------------------------------------------------------------
// Safe SSR memory queries — caller MUST pass cookieHeader.
// Never call headers() or cookies() directly in here.
//------------------------------------------------------------

import { createClientServer } from "@/lib/supabase/server";

export type MemoryHit = {
  id?: string;
  user_key?: string;
  workspace_id?: string;
  title?: string;
  content?: string;
  created_at?: string;
};

/**
 * Fetch recent memories safely in Next.js 16.
 * The caller MUST pass `cookieHeader`, retrieved via:
 * 
 *   const cookieHeader = req.headers.get("cookie") ?? ""
 */
export async function fetchRecentMemories(
  workspaceId: string,
  limit = 50,
  cookieHeader: string = ""
) {
  const sb = createClientServer(cookieHeader);

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

/**
 * Fetch one memory by ID, same safe pattern.
 */
export async function fetchMemoryById(
  id: string,
  cookieHeader: string = ""
) {
  const sb = createClientServer(cookieHeader);

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

