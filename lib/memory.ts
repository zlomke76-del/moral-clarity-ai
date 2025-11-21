// lib/memory.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";
import { classifyMemoryText } from "./memory-classifier";
import { summarizeEpisode, storeEpisode } from "./episodic";

export const EMBEDDING_MODEL = "text-embedding-3-small";

const sb = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

async function embed(text: string): Promise<number[]> {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });
  const j = await r.json();
  return j?.data?.[0]?.embedding ?? [];
}

export type Memory = {
  id?: string;
  user_key: string;
  content: string;
  purpose?: string;
  title?: string | null;
  workspace_id?: string | null;
};

export async function remember(m: Memory) {
  const client = sb();
  const vec = await embed(m.content);

  let classification = null;
  try {
    classification = await classifyMemoryText(m.content);
  } catch {
    classification = null;
  }

  const { data, error } = await client
    .from("user_memories")
    .insert([
      {
        user_key: m.user_key,
        kind: m.purpose ?? "fact",
        title: m.title ?? null,
        content: m.content,
        weight: 1,
        expires_at: null,
        embedding: vec,
        workspace_id: m.workspace_id ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    row: data,
    classification,
  };
}

/* ================== Episodic Trigger ================== */

export async function maybeStoreEpisode(
  user_key: string,
  workspace_id: string | null,
  messages: { role: string; content: string }[]
) {
  // Only store if >= 3 user turns
  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns < 3) return;

  const ep = await summarizeEpisode(messages);
  ep.user_key = user_key;
  ep.workspace_id = workspace_id;

  await storeEpisode(user_key, workspace_id, ep);
}

/* ================== Recall ================== */

export async function searchUserFacts(user_key: string, query: string, k = 8) {
  const client = sb();
  const qvec = await embed(query);

  const { data, error } = await client.rpc("match_user_memories_v2", {
    p_user_key: user_key,
    p_query_embedding: qvec,
    p_match_count: k,
  });

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    id: m.id,
    content: m.content,
    purpose: m.kind,
    similarity: m.similarity,
  }));
}

export async function searchEpisodes(user_key: string, query: string, k = 3) {
  const client = sb();
  const qvec = await embed(query);

  const { data, error } = await client.rpc("match_episodic_memories", {
    p_user_key: user_key,
    p_query_embedding: qvec,
    p_match_count: k,
  });

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    id: m.id,
    summary: m.episode_summary,
    episodic_type: m.episodic_type,
    similarity: m.similarity,
  }));
}

export async function getMemoryPack(user_key: string, query: string) {
  const facts = await searchUserFacts(user_key, query, 8);
  const episodes = await searchEpisodes(user_key, query, 3);

  const factLines = facts.map((m) => `• (${m.purpose}) ${m.content}`).join("\n");
  const episodeLines = episodes
    .map((e) => `• [Episode: ${e.episodic_type}] ${e.summary}`)
    .join("\n\n");

  return `
EPISODIC MEMORY
${episodeLines || "• (none)"}

FACT MEMORY
${factLines || "• (none)"}
`;
}
