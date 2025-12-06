// lib/memory.ts
// Primary interface for storing, searching, and retrieving memory.
// Delegates intelligence to memory-intelligence.ts and ethics pipeline.

import { createClient } from "@supabase/supabase-js";

import {
  consolidateMemory,
  buildMemoryPack,
  storeEpisode,
  searchMemoryIndex,
  evaluateAndClassifyMemory,
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
  | "identity"
  | "value"
  | "insight"
  | "note"
  | "episode";

/* -------------------------------------------------------------------------- */
/*                                 REMEMBER                                   */
/* -------------------------------------------------------------------------- */

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
  // 1. Ethical & lifecycle classification
  const { decision } = await evaluateAndClassifyMemory(user_key, content);

  if (!decision.allowed || !decision.store) {
    return { blocked: true, reason: "restricted" };
  }

  // 2. Pre-merge consolidation
  const merged = await consolidateMemory(user_key, content);
  if (merged?.mergedInto) return { mergedInto: merged.mergedInto };

  // 3. Assign FINAL kind (from oversight engine)
  const kind = decision.finalKind || purpose || "note";

  // 4. Insert memory
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      content,
      title,
      kind,
      workspace_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 5. Fact promotion handled inside finalKind (no extra logic needed)

  return data;
}

/* -------------------------------------------------------------------------- */
/*                               SIMPLE SEARCH                                */
/* -------------------------------------------------------------------------- */

export async function searchMemories(user_key: string, query: string) {
  return await searchMemoryIndex(user_key, query);
}

/* -------------------------------------------------------------------------- */
/*                               MEMORY PACK                                  */
/* -------------------------------------------------------------------------- */

export async function getMemoryPack(
  user_key: string,
  query: string,
  opts: { factsLimit: number; episodesLimit: number }
) {
  return await buildMemoryPack(user_key, query, opts);
}

/* -------------------------------------------------------------------------- */
/*                           OPTIONAL EPISODE STORAGE                          */
/* -------------------------------------------------------------------------- */

export async function maybeStoreEpisode(
  user_key: string,
  content: string,
  shouldStore: boolean
) {
  if (!shouldStore) return;
  await storeEpisode(user_key, content);
}


