// lib/memory/fetchWorkspaceMemories.ts
// ------------------------------------------------------------
// CLIENT-SIDE workspace memory fetcher
//
// ARCHITECTURAL CONTRACT:
// - Auth is COOKIE-BASED ONLY
// - No Bearer tokens
// - No Supabase client here
// - Server enforces auth + RLS
//
// This file MUST remain browser-safe.
// ------------------------------------------------------------

export type WorkspaceMemory = {
  id: string;
  workspace_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<WorkspaceMemory[]> {
  if (!workspaceId) {
    throw new Error("workspaceId is required");
  }

  const res = await fetch(
    `/api/memory/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",
      credentials: "include", // 🔑 REQUIRED: sends Supabase cookies
      cache: "no-store",
    }
  );

  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error ? `: ${body.error}` : "";
    } catch {
      /* ignore */
    }

    throw new Error(`Failed to load workspace memories (${res.status})${detail}`);
  }

  const json = await res.json();

  return Array.isArray(json.items) ? json.items : [];
}
