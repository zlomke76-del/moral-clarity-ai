// app/api/chat/modules/memory-writer.ts

import { createClient } from "@supabase/supabase-js";

/**
 * Edge-safe Supabase client using ROLE KEY
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,   // ✅ correct key for Edge
  { auth: { persistSession: false } }
);

/**
 * Write a short factual memory when Solace explicitly says
 * "I will remember that" or patterns like that.
 */
export async function writeMemory(userKey: string, content: string) {
  if (!userKey || !content) return;

  const record = {
    user_key: userKey,
    kind: "fact",
    content,
    weight: 1,
    importance: 1,
    source_channel: "conversation",
  };

  const { error } = await supabase.from("user_memories").insert(record);

  if (error) {
    console.error("[memory-writer] insert error:", error);
  }
}

/**
 * Write an episodic memory (optional future expansion)
 */
export async function writeEpisode(
  userKey: string,
  summary: string,
  chunks: string[]
) {
  if (!userKey || !summary) return;

  const { data: episode, error: epError } = await supabase
    .from("episodic_memories")
    .insert({
      user_key: userKey,
      episode_summary: summary,
      episodic_type: "conversation",
    })
    .select("*")
    .single();

  if (epError || !episode) {
    console.error("[memory-writer] episode insert error:", epError);
    return;
  }

  // Write chunks in sequence
  const chunkRows = chunks.map((c, i) => ({
    episode_id: episode.id,
    seq: i,
    chunk: c,
  }));

  const { error: chunkError } = await supabase
    .from("memory_episode_chunks")
    .insert(chunkRows);

  if (chunkError) {
    console.error("[memory-writer] chunk insert error:", chunkError);
  }
}

