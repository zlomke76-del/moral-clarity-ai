// lib/memory.ts

import { createClient } from "@supabase/supabase-js";
import { consolidateMemory } from "./memory-intelligence";

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
  | "episode"
  | "other";

/**
 * Create a new memory record with consolidation intelligence.
 */
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
  // 1. Consolidation check
  const consolidation = await consolidateMemory(user_key, content);
  if (consolidation?.mergedInto) {
    return { mergedInto: consolidation.mergedInto };
  }

  // 2. Base importance mapping
  const importance =
    purpose === "fact"
      ? 1
      : purpose === "context"
      ? 2
      : purpose === "preference"
      ? 3
      : 4;

  // 3. Insert memory
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
   BACKWARD COMPATIBILITY EXPORTS
   The chat engine and API endpoints still import these.
   Keeping them avoids breaking the entire system.
   ============================================================ */

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/**
 * Old API: keyword search over memories
 */
export async function searchMemories(user_key: string, query: string) {
  const { data, error } = await sb
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key);

  if (error) throw new Error(error.message);

  if (!query) return data;

  const q = query.toLowerCase();
  return data.filter((m) => m.content?.toLowerCase().includes(q));
}

/**
 * Old API: pack of memories sorted by importance + recency
 */
export async function getMemoryPack(user_key: string) {
  const { data, error } = await sb
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("importance")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return {
    user_key,
    memories: data ?? [],
    count: data?.length ?? 0,
  };
}

/**
 * Old API: episode storage
 * For compatibility, episodes map to purpose="episode"
 */
export async function maybeStoreEpisode(user_key: string, text: string) {
  if (!text || text.length < 20) return null;

  const row = await remember({
    user_key,
    content: text,
    purpose: "episode",
  });

  return row;
}


