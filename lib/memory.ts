// lib/memory.ts
// Phase 4 — Ethical Memory Engine Integration

import { createClient } from "@supabase/supabase-js";
import {
  analyzeMemoryWrite,
  rankMemories,
} from "./memory-intelligence";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type MemoryPurpose =
  | "identity"
  | "value"
  | "insight"
  | "fact"
  | "preference"
  | "context"
  | "episode"
  | "note";

async function fetchRecentMemories(user_key: string, limit = 20) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}

export async function remember({
  user_key,
  content,
  title = null,
  purpose = null,
  workspace_id = null,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  purpose?: string | null;
  workspace_id?: string | null;
}) {
  const recent = await fetchRecentMemories(user_key, 20);

  const evaluation = await analyzeMemoryWrite(content, recent);
  const { classification, lifecycle, oversight } = evaluation;

  if (!oversight.allowed || !oversight.store) {
    return {
      stored: false,
      reason: "blocked_by_oversight",
      classification,
    };
  }

  const finalKind =
    (purpose as MemoryPurpose) ||
    (oversight.finalKind as MemoryPurpose);

  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      title,
      content,
      kind: finalKind,
      importance: lifecycle.promoteToFact ? 5 : 3,
      emotional_weight: classification.emotional,
      sensitivity_score: classification.sensitivity,
      workspace_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return {
    stored: true,
    memory: data,
    classification,
    lifecycle,
    oversight,
  };
}

export async function searchMemories(
  user_key: string,
  query: string
) {
  const { data } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key);

  if (!data) return [];

  const matches = data.filter((m) =>
    m.content.toLowerCase().includes(query.toLowerCase())
  );

  return rankMemories(matches);
}
