// lib/memory-intelligence.ts

import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/**
 * importance scale:
 * 1 = Fact (stable, never overwritten automatically)
 * 2 = Key Context (moderately stable)
 * 3 = Preference (adaptive)
 * 4 = Narrative/Episode (volatile)
 */

/** Reinforce memory importance based on usage pattern */
export async function reinforceMemory(id: string) {
  await supabase.rpc("increment_memory_importance", { mem_id: id }).catch(() => {});
}

/** When new content conflicts with older memories, rewrite or merge. */
export async function consolidateMemory(user_key: string, newContent: string) {
  // Pull last 50 memories for comparison
  const { data: recent } = await supabase
    .from("user_memories")
    .select("id, content, importance")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!recent) return;

  // Simple heuristic: check for near-duplicates
  for (const mem of recent) {
    if (!mem.content) continue;

    const overlap =
      similarity(mem.content.toLowerCase(), newContent.toLowerCase());

    // If highly similar, reinforce instead of adding duplicate
    if (overlap > 0.85) {
      await reinforceMemory(mem.id);
      return { mergedInto: mem.id };
    }
  }

  return null;
}

/** Tiny similarity scorer for consolidation */
function similarity(a: string, b: string) {
  const as = new Set(a.split(" "));
  const bs = new Set(b.split(" "));
  let match = 0;
  as.forEach((w) => bs.has(w) && match++);
  return match / Math.max(as.size, bs.size);
}

/** Optional summarizer hook for high-volume narratives */
export async function summarizeNarratives(user_key: string) {
  // Identify all importance-4 memories older than 30 days
  const { data: old } = await supabase
    .from("user_memories")
    .select("id, content")
    .eq("user_key", user_key)
    .eq("importance", 4)
    .lte("created_at", new Date(Date.now() - 30 * 86400_000).toISOString());

  if (!old?.length) return;

  const combined = old.map((m) => m.content).join("\n\n");

  // Replace with a summarization (LLM call eventually)
  const summary = `Summary of your past narratives:\n${combined.slice(0, 2000)}...`;

  // Insert compressed summary
  await supabase.from("user_memories").insert({
    user_key,
    content: summary,
    importance: 3,
    kind: "note",
  });

  // Soft delete old items
  await Promise.all(
    old.map((m) =>
      supabase.from("user_memories").update({ deleted_at: new Date().toISOString() }).eq("id", m.id)
    )
  );
}
