// lib/memory/fetchWorkspaceMemories.ts
// ============================================================
// CLIENT → API memory fetch
// Explicit bearer-token auth
// ============================================================

import { createClientBrowser } from "@/lib/supabase/browser";
import type { MemoryRecord } from "@/app/w/[workspaceId]/memory/types";

export async function fetchWorkspaceMemories(
  workspaceId: string
): Promise<MemoryRecord[]> {
  const supabase = createClientBrowser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Unauthenticated");
  }

  const res = await fetch(
    `/api/memory/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? "Memory fetch failed");
  }

  const json = await res.json();
  return json.items ?? [];
}
