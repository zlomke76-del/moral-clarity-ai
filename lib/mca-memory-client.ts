// lib/mca-memory-client.ts
import { MCA_WORKSPACE_ID } from "@/lib/mca-config";

/* -------------------------------------------------------
 * Workspace memories (existing behavior, if you still use it)
 * ------------------------------------------------------ */

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
  const r = await fetch(url, { method: "GET", cache: "no-store" });
  if (!r.ok) throw new Error(`memory list ${r.status}`);
  const j = await r.json();
  return (j.rows || []) as WorkspaceMemoryRow[];
}

export async function createWorkspaceMemory(input: {
  title?: string;
  content: string;
}) {
  const r = await fetch("/api/memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "workspace",
      workspace_id: MCA_WORKSPACE_ID,
      title: input.title ?? null,
      content: input.content,
    }),
  });
  if (!r.ok)
    throw new Error(`memory create ${r.status}: ${await r.text().catch(() => "")}`);
  return (await r.json()) as { id: string };
}

/**
 * Optional helper for user-scoped vector search (if you’re using user_memories + RPC).
 * Pass the same user key you send to /api/chat via X-User-Key, or centralize it in mca-config.
 */
export async function searchUserMemories(
  userKey: string,
  q: string,
  limit = 8
) {
  const url = `/api/memory?mode=user&user_key=${encodeURIComponent(
    userKey
  )}&q=${encodeURIComponent(q)}&limit=${limit}`;
  const r = await fetch(url, { method: "GET", cache: "no-store" });
  if (!r.ok) throw new Error(`user memory search ${r.status}`);
  const j = await r.json();
  return j.rows || [];
}

/* -------------------------------------------------------
 * User memories (unified table: user_memories)
 * For Solace memory page / manual editing.
 * ------------------------------------------------------ */

export type UserMemoryRow = {
  id: string;
  user_key: string;
  title: string | null;
  content: string | null;
  kind: string | null;
  workspace_id: string | null;
  episodic_type: string | null;
  episode_summary: string | null;
  importance: number | null;
  source: string | null;
  origin: string | null;
  created_at: string;
  updated_at: string | null;
};

type ListUserMemoriesOptions = {
  kind?: string; // 'all' | 'fact' | 'episode' | ...
  search?: string;
  limit?: number;
  offset?: number;
};

export async function listUserMemories(
  userKey: string,
  opts: ListUserMemoriesOptions = {}
): Promise<UserMemoryRow[]> {
  const params = new URLSearchParams();
  params.set("user_key", userKey);
  if (opts.kind) params.set("kind", opts.kind);
  if (opts.search) params.set("search", opts.search);
  if (typeof opts.limit === "number")
    params.set("limit", String(opts.limit));
  if (typeof opts.offset === "number")
    params.set("offset", String(opts.offset));

  const url = `/api/user-memories?${params.toString()}`;
  const r = await fetch(url, { method: "GET", cache: "no-store" });
  if (!r.ok)
    throw new Error(`listUserMemories failed: ${r.status} ${r.statusText}`);
  const j = await r.json();
  return (j.rows || []) as UserMemoryRow[];
}

export async function createUserMemory(input: {
  userKey: string;
  content: string;
  kind?: string;
  title?: string;
  workspaceId?: string | null;
}) {
  const r = await fetch("/api/user-memories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userKey: input.userKey,
      content: input.content,
      kind: input.kind ?? "fact",
      title: input.title ?? null,
      workspaceId: input.workspaceId ?? null,
    }),
  });

  if (!r.ok) {
    throw new Error(
      `createUserMemory failed: ${r.status} ${await r.text().catch(() => "")}`
    );
  }
  return r.json();
}

export async function updateUserMemory(
  id: string,
  payload: {
    title?: string;
    content?: string;
    kind?: string;
    importance?: number;
    episode_summary?: string;
  }
) {
  const r = await fetch(`/api/user-memories/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    throw new Error(
      `updateUserMemory failed: ${r.status} ${await r.text().catch(() => "")}`
    );
  }
  return r.json();
}

export async function deleteUserMemory(id: string) {
  const r = await fetch(`/api/user-memories/${id}`, {
    method: "DELETE",
  });

  if (!r.ok) {
    throw new Error(
      `deleteUserMemory failed: ${r.status} ${await r.text().catch(() => "")}`
    );
  }
  return r.json();
}

