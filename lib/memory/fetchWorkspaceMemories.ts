export const supabase = createBrowserClient(...);
```

**You must:**
- Replace the import with a singleton usage.
- Remove all references to `createClientBrowser()`.

---

# PHASE-ALIGNED FILE: `lib/memory/fetchWorkspaceMemories.ts`

```ts
// lib/memory/fetchWorkspaceMemories.ts
// ============================================================
// Client-side workspace memory fetch
// Auth: forwards Supabase access token to API using singleton client
// ============================================================

import { supabase } from "@/lib/supabase/browser";

export type WorkspaceMemory = {
  id: string;
  workspace_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
};

export async function fetchWorkspaceMemories(workspaceId: string) {
  // ----------------------------------------------------------
  // Get active session
  // ----------------------------------------------------------
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error("No active session");
  }

  // ----------------------------------------------------------
  // Call API with Bearer token
  // ----------------------------------------------------------
  const res = await fetch(
    `/api/memory/workspace?workspaceId=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Request failed (${res.status})`);
  }

  const json = await res.json();
  return (json.items ?? []) as WorkspaceMemory[];
}
