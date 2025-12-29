import { createClientBrowser } from "@/lib/supabase/browser";
import type { MemoryRecord } from "@/types/memory"; // adjust path if needed

export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<MemoryRecord[]> {
  const supabase = createClientBrowser();

  // 🔐 Get session explicitly
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
    throw new Error(err?.error ?? "Failed to load memories");
  }

  const json = await res.json();
  return json.items ?? [];
}
