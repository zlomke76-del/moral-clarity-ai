// lib/memory-intelligence.ts

import { createClient } from "@supabase/supabase-js";

// Server key client (service role) — for internal ops
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/* ============================================================
   EMBEDDING UTILS
   (We keep these lightweight — not calling OpenAI directly here.
   Chat/route.ts runs the LLM, this layer only performs DB logic.)
   ============================================================ */

async function embed(text: string): Promise<number[] | null> {
  try {
    const res = await fetch(process.env.EMBEDDING_API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text }),
    });

    const j = await res.json();
    return j.embedding || null;
  } catch {
    return null;
  }
}

/* ============================================================
   1. CONSOLIDATION CHECK:
      Detect near-duplicates and merge.
   ============================================================ */

export async function consolidateMemory(user_key: string, content: string) {
  const embedding = await embed(content);
  if (!embedding) return null;

  // Search recent memories for similarity
  const { data: recent, error } = await supabase
    .rpc("match_memories", {
      query_embedding: embedding,
      match_threshold: 0.88,
      match_count: 5,
      p_user_key: user_key,
    });

  if (error || !recent?.length) return null;

  const closest = recent[0];
  if (closest.similarity < 0.88) return null;

  // Merge by updating the existing memory’s content
  const merged = `${closest.content}\n\n[[Merged Update]] ${content}`.trim();

  await supabase
    .from("user_memories")
    .update({ content: merged })
    .eq("id", closest.id);

  return { mergedInto: closest.id };
}

/* ============================================================
   2. RELEVANCE WEIGHTING
   ============================================================ */

export function scoreMemory(m: any, query: string): number {
  let score = 0;

  if (m.kind === "fact") score += 3;
  if (m.kind === "preference") score += 2;

  if (m.content?.toLowerCase().includes(query.toLowerCase())) {
    score += 5;
  }

  score += 4 - (m.importance || 4);

  return score;
}

/* ============================================================
   3. BUILD MEMORY PACK FOR SOLACE
   ============================================================ */

export async function buildMemoryPack(user_key: string, query: string, opts: {
  factsLimit: number;
  episodesLimit: number;
}) {
  const { data: all, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false });

  if (error || !all) return { facts: [], episodes: [] };

  const scored = all
    .map((m) => ({ m, score: scoreMemory(m, query) }))
    .sort((a, b) => b.score - a.score);

  const facts = scored
    .filter((x) => x.m.kind === "fact")
    .slice(0, opts.factsLimit)
    .map((x) => x.m);

  const episodes = scored
    .filter((x) => x.m.kind === "episode" || x.m.kind === "note")
    .slice(0, opts.episodesLimit)
    .map((x) => x.m);

  return { facts, episodes };
}

/* ============================================================
   4. EPISODE STORAGE
   ============================================================ */

export async function storeEpisode(user_key: string, content: string) {
  await supabase.from("user_memories").insert({
    user_key,
    content,
    kind: "episode",
    importance: 4,
  });
}
