// lib/memory-server.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const srk = process.env.SUPABASE_SERVICE_ROLE_KEY!; // SRK required (server only)

type MemoryItem = {
  id: string;
  workspace_id: string;
  user_key: string | null;
  content: string;
  tags: string[] | null;
  created_at: string;
};

function admin() {
  // use SRK; never import this file on the client
  return createClient(url, srk, { db: { schema: 'mca' } });
}

/** Read the last N memories for a workspace/user within a timebox. */
export async function readMemories(opts: {
  workspaceId: string;
  userKey?: string | null;
  limit?: number;
  hours?: number;
}) {
  const { workspaceId, userKey = null, limit = 50, hours = 720 } = opts;
  const since = new Date(Date.now() - hours * 3600_000).toISOString();
  const supa = admin();

  // user-scoped first, then workspace-scoped facts
  const { data: userRows, error: e1 } = await supa
    .from<MemoryItem>('memories')
    .select('content,tags,created_at')
    .eq('workspace_id', workspaceId)
    .eq('user_key', userKey)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data: wsRows, error: e2 } = await supa
    .from<MemoryItem>('memories')
    .select('content,tags,created_at')
    .eq('workspace_id', workspaceId)
    .is('user_key', null)
    .order('created_at', { ascending: false })
    .limit(Math.max(10, Math.floor(limit / 2)));

  if (e1 || e2) throw e1 || e2;

  return {
    user: userRows ?? [],
    workspace: wsRows ?? [],
  };
}

/** Write a new memory row. */
export async function writeMemory(input: {
  workspaceId: string;
  userKey?: string | null;
  content: string;
  tags?: string[];
}) {
  const supa = admin();
  const { error } = await supa.from('memories').insert({
    workspace_id: input.workspaceId,
    user_key: input.userKey ?? null,
    content: input.content,
    tags: input.tags ?? null,
  });
  if (error) throw error;
}

/** Light heuristic: does user ask to remember? returns normalized text or null */
export function extractMemoryIntent(text: string): string | null {
  const t = text.trim();
  const m =
    /^remember(?: that)?\s+(.+)$/i.exec(t) ||
    /(please|can you)\s+remember\s+(.+)$/i.exec(t);
  if (!m) return null;
  const payload = (m[1] ?? m[2] ?? '').trim();
  return payload ? payload : null;
}
