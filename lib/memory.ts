// lib/memory.ts
// Phase 4 — Ethical Memory Engine (Authoritative, Schema-Aligned)

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
  user_key,              // ← auth.uid() as string
  email = null,
  content,
  purpose = null,
  workspace_id = null,
}: {
  user_key: string;
  email?: string | null;
  content: string;
  purpose?: string | null;
  workspace_id?: string | null;
}) {
  /* 1. Fetch recent memories */
  const { data: recent } = await supabase
    .from("memory.memories")
    .select("*")
    .eq("user_id", user_key)
    .order("created_at", { ascending: false })
    .limit(10);

  /* 2. Epistemic analysis */
  const analysis = analyzeMemoryWrite(content, recent ?? []);
  if (!analysis.oversight.store) {
    return {
      stored: false,
      reason: "blocked_by_oversight",
      analysis,
    };
  }

  /* 3. Semantic classification */
  const semantic = await classifyMemoryText(content);

  /* 4. Confidence synthesis */
  const confidence =
    0.4 * analysis.lifecycle.confidence +
    0.3 * semantic.confidence +
    0.3 * (recent && recent.length > 0 ? 0.7 : 0.3);

  /* 5. Promotion logic */
  const promotedToFact = confidence >= 0.9;

  const memoryType =
    promotedToFact
      ? "fact"
      : analysis.oversight.finalKind ?? purpose ?? "note";

  /* 6. Persist (schema-aligned) */
  const { data, error } = await supabase
    .from("memory.memories")
    .insert({
      user_id: user_key,
      email,
      workspace_id,
      memory_type: memoryType,
      source: "solace",
      content,
      weight: confidence,
      is_active: true,
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
    kind: memoryType,
    promotedToFact,
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
    .from("memory.memories")
    .select("*")
    .eq("user_id", user_key)
    .eq("is_active", true);

  if (error || !data) return [];

  const q = query.toLowerCase();

  return data
    .filter((m) => m.content?.toLowerCase().includes(q))
    .map((m) => ({
      ...m,
      _score: (m.weight ?? 0),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}
