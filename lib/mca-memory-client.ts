// /lib/mca-memory-client.ts
import { MCA_USER_KEY, MCA_WORKSPACE_ID } from './mca-config';

const API_BASE = process.env.NEXT_PUBLIC_APP_ORIGIN ?? ''; // "" works for same-origin

export type SavedMemory = {
  id: string;
  user_key: string;
  kind: string;
  title?: string | null;
  content: string;
  weight?: number;
  created_at?: string;
  similarity?: number;
};

export async function saveUserMemory(input: {
  content: string;
  kind?: 'fact'|'note'|'task'|'profile'|'preference';
  title?: string;
  weight?: number;
}) {
  const res = await fetch(`${API_BASE}/api/memory`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      mode: 'user',
      workspace_id: MCA_WORKSPACE_ID,
      user_key: MCA_USER_KEY,
      kind: input.kind ?? 'note',
      title: input.title ?? '',
      content: input.content,
      weight: input.weight ?? 1,
    }),
  });
  if (!res.ok) throw new Error(`saveUserMemory failed: ${res.status}`);
  return (await res.json()) as { id: string };
}

export async function searchUserMemories(q: string, k = 8) {
  const url = new URL(`${API_BASE}/api/memory`, globalThis.location?.origin ?? 'http://localhost');
  url.searchParams.set('mode', 'user');
  url.searchParams.set('user_key', MCA_USER_KEY);
  url.searchParams.set('q', q);
  url.searchParams.set('limit', String(k));
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) throw new Error(`searchUserMemories failed: ${res.status}`);
  const j = await res.json();
  return (j.rows ?? []) as SavedMemory[];
}

export async function recentUserMemories(k = 8) {
  const url = new URL(`${API_BASE}/api/memory`, globalThis.location?.origin ?? 'http://localhost');
  url.searchParams.set('mode', 'user');
  url.searchParams.set('user_key', MCA_USER_KEY);
  url.searchParams.set('limit', String(k));
  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) throw new Error(`recentUserMemories failed: ${res.status}`);
  const j = await res.json();
  return (j.rows ?? []) as SavedMemory[];
}
