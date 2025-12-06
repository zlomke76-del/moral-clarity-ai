// lib/memory.ts

import { createClient } from "@supabase/supabase-js";
import {
  consolidateMemory,
  buildMemoryPack,
  storeEpisode,
  searchMemoryIndex,
} from "./memory-intelligence";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type MemoryPurpose =
  | "fact"
  | "identity"
  | "value"
  | "insight"
  | "context"
  | "note";

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
    purpose === "identity"
      ? 1
      : purpose === "value"
      ? 2
      : purpose === "fact"
      ? 3
      : purpose === "insight"
      ? 4
      : 5;

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
   REQUIRED EXPORT #1 — searchMemories  (used in chat + API)
   ============================================================ */
export async function searchMemories(user_key: string, query: string) {
  return await searchMemoryIndex(user_key, query);
}

/* ============================================================
   REQUIRED EXPORT #2 — getMemoryPack (used in chat route)
   ============================================================ */
export async function getMemoryPack(
  user_key: string,
  query: string,
  opts: { factsLimit: number; episodesLimit: number }
) {
  return await buildMemoryPack(user_key, query, opts);
}

/* ============================================================
   REQUIRED EXPORT #3 — maybeStoreEpisode (used in chat route)
   ============================================================ */
export async function maybeStoreEpisode(
  user_key: string,
  messages: { role: string; content: string }[],
  shouldStore: boolean
) {
  if (!shouldStore) return;
  await storeEpisode(user_key, messages);
}


