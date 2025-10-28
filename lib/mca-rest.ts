// lib/mca-rest.ts
export type MemoryListRow = {
  id: string;
  title: string | null;
  created_at: string;
  workspace_id: string;
};

export type MemoryDetailRow = {
  id: string;
  title: string | null;
  content: string | null;   // nullable is safe; table may or may not have it yet
  created_at: string;
  workspace_id: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function restGet<T = unknown>(path: string, query: string): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${path}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST error (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listMemories(workspaceId: string): Promise<MemoryListRow[]> {
  const path = "mca.memories";
  const query = new URLSearchParams({
    "workspace_id": `eq.${workspaceId}`,
    "select": "id,title,created_at,workspace_id",
    "order": "created_at.desc",
    "limit": "50",
  }).toString();
  return restGet<MemoryListRow[]>(path, query);
}

export async function getMemoryById(id: string): Promise<MemoryDetailRow | null> {
  const path = "mca.memories";
  const query = new URLSearchParams({
    "id": `eq.${id}`,
    "select": "id,title,content,created_at,workspace_id",
    "limit": "1",
  }).toString();
  const rows = await restGet<MemoryDetailRow[]>(path, query);
  return rows[0] ?? null;
}
