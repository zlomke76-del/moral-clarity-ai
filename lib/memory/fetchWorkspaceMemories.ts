"use client";

// ============================================================
// FETCH WORKSPACE MEMORIES (CLIENT → API, TOKEN-BOUND)
//
// Architectural guarantees:
// - Runs ONLY in the browser
// - Uses the active Supabase session
// - Sends explicit Bearer token to API
// - API enforces auth + RLS
// - Zero cookie dependence
// ============================================================

import { createClientBrowser } from "@/lib/supabase/browser";

/**
 * Canonical memory record shape returned by the API.
 * This is intentionally local to avoid fragile cross-route imports.
 */
export type MemoryRecord = {
  id: string;
  workspace_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  updated_at: string | null;
};

/**
 * Fetch all memories for a workspace the user has access to.
 *
 * Auth model:
 * - Browser owns session
 * - Access token sent via Authorization header
 * - API validates token + applies RLS
 */
export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<MemoryRecord[]> {
  const supabase = createClientBrowser();

  // 🔐 Resolve active session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("No active session");
  }

  // 🌐 Call protected API with explicit Bearer token
  const res = await fetch(
    `/api/memory/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    let detail: any = null;
    try {
      detail = await res.json();
    } catch {
      // ignore
    }

    throw new Error(
      detail?.error || `Failed to load workspace memories (${res.status})`
    );
  }

  const json = await res.json();

  return (json?.items ?? []) as MemoryRecord[];
}
