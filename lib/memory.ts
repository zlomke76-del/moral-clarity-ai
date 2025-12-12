// lib/memory.ts
// Phase 4 — Ethical Memory Engine (Authoritative)

import "server-only";
import { createClient } from "@supabase/supabase-js";

import { analyzeMemoryWrite } from "./memory-intelligence";
import { classifyMemoryText } from "./memory-classifier";

/* ============================================================
   Supabase (service role)
   ============================================================ */

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/* ============================================================
   MEMORY WRITE — learning + promotion
   ============================================================ */

export async function remember({
  user_key,
  content,
  title = null,
  workspace_id = null,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  workspace_id?: string | null;
}) {
  // 1. Fetch recent stable memories
  const { data: recent } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(10);

  // 2. Epistemic analysis
  const analysis = analyzeMemoryWrite(content, recent ?? []);
  if (!analysis.oversight.store) {
    return {
      stored: false,
      reason: "blocked_by_oversight",
      analysis,
    };
  }

  // 3. Semantic classification
  const semantic = await classifyMemoryText(content);

  // 4. Confidence synthesis (learning signal)
  const confidence =
    0.4 * analysis.lifecycle.confidence +
    0.3 * semantic.confidence +
    0.3 * (recent && recent.length > 0 ? 0.7 : 0.3);

  // 5. Promotion logic
  const finalKind =
    confidence >= 0.9 ? "fact" : analysis.oversight.finalKind;

  // 6. Persist
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      title,
      content,
      kind: finalKind,
      confidence,
      importance: finalKind === "fact" ? 5 : 3,
      emotional_weight: analysis.classification.emotional,
      sensitivity_score: analysis.classification.sensitivity,
      workspace_id,
      metadata: {
        semantic,
        lifecycle: analysis.lifecycle,
        drift: analysis.drift,
      },
    })
    .select()
    .single();

  if (error) {
    throw new Error(`[memory.remember] ${error.message}`);
  }

  return {
    stored: true,
    memory: data,
    confidence,
    kind: finalKind,
  };
}

/* ============================================================
   MEMORY SEARCH — ranked recall
   ============================================================ */

export async function searchMemories(
  user_key: string,
  query: string,
  limit = 8
) {
  const { data, error } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key);

  if (error || !data) return [];

  const q = query.toLowerCase();

  const matches = data.filter((m) =>
    m.content?.toLowerCase().includes(q)
  );

  // Simple ranking hook — can be upgraded later
  return matches
    .map((m) => ({
      ...m,
      _score:
        (m.importance ?? 0) +
        (m.confidence ?? 0) * 2,
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}
