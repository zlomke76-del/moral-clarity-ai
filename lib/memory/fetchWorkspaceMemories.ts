// lib/memory/fetchWorkspaceMemories.ts
// ============================================================
// Fetch workspace memories via server API
// Schema-safe: works with memory.memories
// ============================================================

import { createClientBrowser } from "@/lib/supabase/browser";

export type WorkspaceMemory = {
  id: string;
  workspace_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
};

export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<WorkspaceMemory[]> {
  if (!workspaceId) return [];

  const supabase = createClientBrowser();

  // 🔐 Get active session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("Not authenticated");
  }

  // 🔁 Call server API (NOT Supabase REST)
  const res = await fetch(
    `/api/memory/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Failed to load workspace memories (${res.status}): ${body}`
    );
  }

  const json = await res.json();
  return json.items ?? [];
}
