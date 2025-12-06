// lib/memory.ts

import { createClient } from "@supabase/supabase-js";
import {
  consolidateMemory,
  buildMemoryPack,
  storeEpisode,
} from "./memory-intelligence";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type MemoryPurpose =
  | "fact"
  | "preference"
  | "context"
  | "note"
  | "episode";

/* ============================================================
   REMEMBER (INSERT)
   ============================================================ */

export async function remember({
  user_key,
  content,
  title,
  purpose,
  workspace_id,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  purpose?: MemoryPurpose | null;
  workspace_id?: string | null;
}) {
  const merged = await consolidateMemory(user_key, content);
  if (merged?.mergedInto) return { mergedInto: merged.mergedInto };

  const importance =
    purpose === "fact"
      ? 1
      : purpose === "context"
      ? 2
      : purpose === "preference"
      ? 3
      : 4;

  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      content,
      title,
      kind: purpose || "note",
      importance,
      workspace_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* ============================================================
   SEARCH — FIXED SIGNATURE (accepts limit)
   ============================================================ */

export async function searchMemories(
  user_key: string,
  query: string,
  limit: number = 8
) {
  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.filter((m) =>
    m.content?.toLowerCase().includes(query.toLowerCase())
  );
}

/* ============================================================
   MEMORY PACK — (used in Solace system prompt)
   ============================================================ */

export async function getMemoryPack(
  user_key: string,
  query: string,
  opts: { factsLimit: number; episodesLimit: number }
) {
  return await buildMemoryPack(user_key, query, opts);
}

/* ============================================================
   EPISODIC STORAGE
   ============================================================ */

export async function maybeStoreEpisode(
  user_key: string,
  content: string,
  shouldStore: boolean
) {
  if (!shouldStore) return;
  await storeEpisode(user_key, content);
}

