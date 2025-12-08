// lib/memory-server.ts
// ------------------------------------------------------------
// Server-side memory access using safe SSR Supabase client.
// No generics on supabase.from() to avoid TS signature mismatch.
// ------------------------------------------------------------

import { headers } from "next/headers";
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
 * Fetch recent memories for a workspace.
 */
export async function fetchRecentMemories(workspaceId: string, limit = 50) {
  // Read raw cookies from headers (Next.js 16-safe)
  const cookieHeader = headers().get("cookie") ?? "";

  // Create Supabase SSR client
  const sb = createClientServer(cookieHeader);

  const { data, error } = await sb
    .schema("mca")
    .from("memories")
    .select(
      "id, user_key, workspace_id, title, content, created_at"
    )
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
 * Fetch a single memory by ID.
 */
export async function fetchMemoryById(id: string) {
  // Read raw cookies from headers (Next.js 16-safe)
  const cookieHeader = headers().get("cookie") ?? "";

  // Create Supabase SSR client
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
