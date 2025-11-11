// lib/mca-memory-client.ts
import { MCA_WORKSPACE_ID } from '@/lib/mca-config';

export type WorkspaceMemoryRow = {
  id: string;
  workspace_id: string;
  title: string | null;
  content: string | null;
  created_at: string;
};

export async function listWorkspaceMemories(limit = 25) {
  const url = `/api/memory?mode=workspace&workspace_id=${encodeURIComponent(
    MCA_WORKSPACE_ID
  )}&limit=${limit}`;
  const r = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!r.ok) throw new Error(`memory list ${r.status}`);
  const j = await r.json();
  return (j.rows || []) as WorkspaceMemoryRow[];
}

export async function createWorkspaceMemory(input: {
  title?: string;
  content: string;
}) {
  const r = await fetch('/api/memory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'workspace',
      workspace_id: MCA_WORKSPACE_ID,
      title: input.title ?? null,
      content: input.content,
    }),
  });
  if (!r.ok) throw new Error(`memory create ${r.status}: ${await r.text().catch(() => '')}`);
  return r.json() as Promise<{ id: string }>;
}

/**
 * Optional helper for user-scoped vector search (if you’re using user_memories + RPC).
 * Pass the same user key you send to /api/chat via X-User-Key, or centralize it in mca-config.
 */
export async function searchUserMemories(userKey: string, q: string, limit = 8) {
  const url = `/api/memory?mode=user&user_key=${encodeURIComponent(
    userKey
  )}&q=${encodeURIComponent(q)}&limit=${limit}`;
  const r = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!r.ok) throw new Error(`user memory search ${r.status}`);
  const j = await r.json();
  return j.rows || [];
}
