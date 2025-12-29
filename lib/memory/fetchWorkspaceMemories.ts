import { createClientBrowser } from "@/lib/supabase/browser";

/**
 * Minimal memory record shape used by the UI.
 * This avoids importing app-route types,
 * which are not available at build time.
 */
export type MemoryRecord = {
  id: string;
  content: string;
  created_at: string;
  workspace_id: string;
  user_id: string;
  type?: string | null;
};

export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<MemoryRecord[]> {
  const supabase = createClientBrowser();

  // 🔐 Explicit session resolution (browser-owned)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `/api/memory/workspace?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? "Failed to load workspace memories");
  }

  const json = await res.json();
  return json.items ?? [];
}
