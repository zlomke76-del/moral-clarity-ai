// lib/memory/fetchWorkspaceMemories.ts
// ============================================================
// WORKSPACE MEMORY FETCH (CLIENT)
// Cookie-authenticated, same-origin, RLS enforced
// ============================================================

export type WorkspaceMemoryRecord = {
  id: string;
  workspace_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
  updated_at: string | null;
};

export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<WorkspaceMemoryRecord[]> {
  if (!workspaceId) {
    throw new Error("workspaceId is required");
  }

  const res = await fetch(
    `/api/memory/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",

      // 🔑 THIS IS THE FIX
      // Forces browser to forward Supabase auth cookies
      credentials: "include",

      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    let detail: any = null;
    try {
      detail = await res.json();
    } catch {
      /* noop */
    }

    const message =
      detail?.error ??
      `Failed to load workspace memories (status ${res.status})`;

    const err = new Error(message);
    (err as any).status = res.status;
    throw err;
  }

  const json = await res.json();

  // API contract: { items: [...] }
  if (!json || !Array.isArray(json.items)) {
    throw new Error("Malformed response from memory API");
  }

  return json.items as WorkspaceMemoryRecord[];
}
