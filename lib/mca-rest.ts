// lib/mca-rest.ts
// Tiny REST helper for querying the mca schema via PostgREST.
// Avoids supabase-js generics to keep TS simple and builds fast.

export type MemoryListRow = {
  id: string;
  title: string | null;
  created_at: string;
  workspace_id: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Generic GET wrapper for mca.* tables
async function getFromMca<T = unknown>(path: string, query: string): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${path}?${query}`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: "application/json",
    },
    // Ensure no accidental caching of user-scoped data
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST error (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

// List memories for a given workspace (newest first, capped at 50)
export async function listMemories(workspaceId: string): Promise<MemoryListRow[]> {
  // mca schema → use path "mca.memories"
  const path = "mca.memories";

  // PostgREST filters:
  //  - workspace_id=eq.<id>
  //  - select fields
  //  - order by created_at desc (nulls last)
  //  - limit 50
  const query = new URLSearchParams({
    "workspace_id": `eq.${workspaceId}`,
    "select": "id,title,created_at,workspace_id",
    "order": "created_at.desc",
    "limit": "50",
  }).toString();

  return getFromMca<MemoryListRow[]>(path, query);
}
