// lib/mca-memory-client.ts
//
// High-level client used by the Memory Page to read/write
// the consolidated `user_memories` table.
//
// Table definition:
//
// id              uuid PK
// user_key        text  (email)
// title           text
// content         text
// kind            text  ('fact' | 'episode' | 'profile' | 'note' | 'preference')
// workspace_id    uuid | null
// embedding       vector(1536) | null
// episodic_type   text | null
// episode_summary text | null
// importance      smallint | null
// source          text | null
// origin_text     text | null
// created_at      timestamptz
// updated_at      timestamptz
//

import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export type UserMemoryRow = {
  id: string;
  user_key: string;
  title: string | null;
  content: string | null;
  kind: string | null;
  workspace_id: string | null;
  episodic_type: string | null;
  episode_summary: string | null;
  created_at: string | null;
  updated_at: string | null;
};

/* -------------------------------------------------------
   List memories for one user
-------------------------------------------------------- */
export async function listUserMemories(
  userKey: string,
  opts?: {
    kind?: string;
    search?: string;
    limit?: number;
  }
): Promise<UserMemoryRow[]> {
  if (!userKey) return [];

  const supabase = createSupabaseBrowser();

  let q = supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", userKey)
    .order("created_at", { ascending: false });

  if (opts?.kind && opts.kind !== "all") {
    q = q.eq("kind", opts.kind);
  }

  if (opts?.search) {
    q = q.or(
      `content.ilike.%${opts.search}%,title.ilike.%${opts.search}%,episode_summary.ilike.%${opts.search}%`
    );
  }

  if (opts?.limit) {
    q = q.limit(opts.limit);
  }

  const { data, error } = await q;

  if (error) {
    console.error("listUserMemories error:", error);
    throw error;
  }

  return (data || []) as UserMemoryRow[];
}

/* -------------------------------------------------------
   Create new memory row
-------------------------------------------------------- */
export async function createUserMemory(args: {
  userKey: string;
  content: string;
  kind: string;
  title?: string | null;
  workspaceId?: string | null;
}): Promise<string> {
  const supabase = createSupabaseBrowser();

  const { userKey, content, kind, title, workspaceId } = args;

  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key: userKey,
      content,
      kind,
      title: title || null,
      workspace_id: workspaceId || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createUserMemory error:", error);
    throw error;
  }

  return data.id;
}

/* -------------------------------------------------------
   Update memory
-------------------------------------------------------- */
export async function updateUserMemory(
  id: string,
  fields: {
    title?: string | null;
    content?: string;
    kind?: string;
  }
): Promise<void> {
  const supabase = createSupabaseBrowser();

  const { error } = await supabase
    .from("user_memories")
    .update({
      title: fields.title ?? null,
      content: fields.content ?? null,
      kind: fields.kind ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("updateUserMemory error:", error);
    throw error;
  }
}

/* -------------------------------------------------------
   Delete memory
-------------------------------------------------------- */
export async function deleteUserMemory(id: string): Promise<void> {
  const supabase = createSupabaseBrowser();

  const { error } = await supabase
    .from("user_memories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteUserMemory error:", error);
    throw error;
  }
}

