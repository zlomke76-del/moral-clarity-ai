// lib/memory.ts
// Phase 4 — Ethical Memory Engine (Authoritative Write Path)

import "server-only";
import { createClient } from "@supabase/supabase-js";

import { analyzeMemoryWrite } from "./memory-intelligence";
import { classifyMemoryText } from "./memory-classifier";

/* ============================================================
   Supabase Client (service role, server-only)
   ============================================================ */

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

/* ============================================================
   Memory Routing
   ============================================================ */

type MemoryRoute =
  | "user_memories"   // stable facts / identity / values
  | "memory_notes"   // provisional, low-confidence
  | "memory_context" // short-lived situational
  | "memory_episodes";

function routeMemory({
  kind,
  confidence,
}: {
  kind: string;
  confidence: number;
}): MemoryRoute {
  // Episodes are always isolated
  if (kind === "episode") return "memory_episodes";

  // High-confidence facts + identity/value are durable
  if (
    kind === "fact" ||
    kind === "identity" ||
    kind === "value"
  ) {
    return confidence >= 0.9 ? "user_memories" : "memory_notes";
  }

  // Context is transient
  if (kind === "context") return "memory_context";

  // Everything else stays provisional
  return "memory_notes";
}

/* ============================================================
   Public API — REMEMBER
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
  /* --------------------------------------------
     1. Fetch recent stable memories (drift base)
     -------------------------------------------- */
  const { data: recent } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(10);

  /* --------------------------------------------
     2. Epistemic analysis (truth lifecycle)
     -------------------------------------------- */
  const analysis = analyzeMemoryWrite(content, recent ?? []);

  if (!analysis.oversight.store) {
    return {
      stored: false,
      reason: "blocked_by_oversight",
      analysis,
    };
  }

  /* --------------------------------------------
     3. Semantic classification (what kind of thing)
     -------------------------------------------- */
  const semantic = await classifyMemoryText(content);

  /* --------------------------------------------
     4. Confidence synthesis (learning mechanism)
     -------------------------------------------- */
  const confidence =
    0.4 * analysis.lifecycle.confidence +
    0.3 * semantic.confidence +
    0.3 * (recent && recent.length > 0 ? 0.7 : 0.3);

  /* --------------------------------------------
     5. Promotion logic (hypothesis → fact)
     -------------------------------------------- */
  const finalKind =
    confidence >= 0.9
      ? "fact"
      : analysis.oversight.finalKind;

  /* --------------------------------------------
     6. Route decision (WHERE it belongs)
     -------------------------------------------- */
  const table = routeMemory({
    kind: finalKind,
    confidence,
  });

  /* --------------------------------------------
     7. Write payload (uniform, explainable)
     -------------------------------------------- */
  const payload = {
    user_key,
    workspace_id,
    title,
    content,
    kind: finalKind,
    confidence,
    importance: finalKind === "fact" ? 5 : 3,
    emotional_weight: analysis.classification.emotional,
    sensitivity_score: analysis.classification.sensitivity,
    metadata: {
      semantic,
      lifecycle: analysis.lifecycle,
      drift: analysis.drift,
    },
  };

  /* --------------------------------------------
     8. Persist
     -------------------------------------------- */
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(
      `[memory.write] ${table}: ${error.message}`
    );
  }

  /* --------------------------------------------
     9. Return explainable result
     -------------------------------------------- */
  return {
    stored: true,
    table,
    id: data.id,
    kind: finalKind,
    confidence,
    metadata: payload.metadata,
  };
}
