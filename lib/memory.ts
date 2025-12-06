// lib/memory.ts
// Deterministic memory interface between Supabase and the Memory Intelligence Engine.

import { createClient } from "@supabase/supabase-js";

import {
  consolidateMemory,
  buildMemoryPack,
  storeEpisode,
  searchMemoryIndex,
  evaluateNewMemory,
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
  | "note"
  | "episode";

/* ---------------------------------------------------------
   BASE STORE FUNCTION (called after ethics + consolidation)
--------------------------------------------------------- */

export async function storeMemoryRow({
  user_key,
  content,
  title,
  kind,
  workspace_id,
  importance,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  kind: MemoryPurpose;
  workspace_id?: string | null;
  importance: number;
}) {
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      content,
      title,
      kind,
      importance,
      workspace_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/* ---------------------------------------------------------
   PUBLIC: REMEMBER()
   The main entrypoint for storing new memory.
--------------------------------------------------------- */

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
  // 1. Ethical + lifecycle evaluation
  const evalResult = evaluateNewMemory(content);
  const { oversight } = evalResult;

  if (!oversight.allowed) {
    return { blocked: true, reason: "ethical_restriction" };
  }

  // 2. Merge logic
  const merge = await consolidateMemory(user_key, content);
  if (merge?.mergedInto) return { mergedInto: merge.mergedInto };

  // 3. Final kind chosen by ethics engine
  const finalKind = oversight.finalKind as MemoryPurpose;

  // 4. Compute importance based on hierarchy
  const importance =
    finalKind === "fact"
      ? 1
      : finalKind === "identity"
      ? 2
      : finalKind === "value"
      ? 3
      : finalKind === "insight"
      ? 3
      : finalKind === "context"
      ? 4
      : 5;

  // 5. Store
  const row = await storeMemoryRow({
    user_key,
    content,
    title,
    kind: finalKind,
    importance,
    workspace_id,
  });

  return row;
}

/* ---------------------------------------------------------
   PUBLIC: SEARCH
--------------------------------------------------------- */

export async function searchMemories(user_key: string, query: string) {
  return await searchMemoryIndex(user_key, query);
}

/* ---------------------------------------------------------
   PUBLIC: MEMORY PACK (for Solace system prompt)
--------------------------------------------------------- */

export async function getMemoryPack(
  user_key: string,
  query: string,
  opts: { factsLimit: number; episodesLimit: number }
) {
  return await buildMemoryPack(user_key, query, opts);
}

/* ---------------------------------------------------------
   PUBLIC: EPISODE STORAGE
--------------------------------------------------------- */

export async function maybeStoreEpisode(
  user_key: string,
  content: string,
  shouldStore: boolean,
  workspace_id?: string | null
) {
  if (!shouldStore) return;
  return await storeEpisode(user_key, content, workspace_id);
}


