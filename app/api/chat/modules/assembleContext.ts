// app/api/chat/modules/assembleContext.ts

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

/**
 * assembleContext builds Solace’s entire cognition block:
 * - user memories (facts)
 * - episodic memories (summaries)
 * - episodic chunks (message-level pieces)
 * - autobiography entries (treated as memory_type='autobio')
 * - newsroom digest pulls
 * - research context (placeholder)
 */

export async function assembleContext({
  overrideUserKey,
  workspaceId,
}: {
  overrideUserKey?: string;
  workspaceId: string | null;
}) {
  const supabase = createClient<Database>();

  // Always get canonical identity first
  const identity = await getCanonicalUserKey({});
  const canonicalKey = overrideUserKey || identity.canonicalKey;

  // -------------------------------------------------------------
  // MEMORY QUERY (single unified view)
  // -------------------------------------------------------------
  const { data: unifiedRows, error: unifiedErr } = await supabase
    .from("vw_unified_memory")
    .select("*")
    .eq("user_key", canonicalKey)
    .order("created_at", { ascending: false })
    .limit(500);

  if (unifiedErr) {
    console.error("[assembleContext] unified memory error:", unifiedErr);
    throw new Error("Failed to load unified memory records");
  }

  // Partition unified memory by type
  const facts = unifiedRows.filter((r) => r.memory_type === "fact");
  const episodic = unifiedRows.filter((r) => r.memory_type === "episode");
  const episodicChunks = unifiedRows.filter(
    (r) => r.memory_type === "episode_chunk"
  );
  const autobiography = unifiedRows.filter(
    (r) => r.memory_type === "autobio"
  );

  // -------------------------------------------------------------
  // NEWSROOM DIGEST (always needed)
  // -------------------------------------------------------------
  const { data: newsDigest, error: newsErr } = await supabase
    .from("vw_solace_news_digest")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(40);

  if (newsErr) {
    console.error("[assembleContext] news digest load error:", newsErr);
  }

  // -------------------------------------------------------------
  // TRUTH FACTS (for grounding)
  // -------------------------------------------------------------
  const { data: truthFacts } = await supabase
    .from("vw_truth_facts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(40);

  // -------------------------------------------------------------
  // CONTEXT PACKAGE
  // -------------------------------------------------------------
  return {
    persona: "Solace",
    memoryPack: {
      userMemories: facts,
      episodicMemories: episodic,
      episodicChunks,
      autobiography,
    },
    newsDigest: newsDigest || [],
    researchContext: truthFacts || [],
  };
}

