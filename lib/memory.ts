// lib/memory.ts

import { createClient } from "@supabase/supabase-js";
import { classifyMemory } from "./ethics/classifier";
import { evaluateMemoryLifecycle } from "./ethics/lifecycle";
import { ethicalOversight } from "./ethics/oversight-engine";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function remember({
  user_key,
  content,
  title,
  workspace_id,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  workspace_id?: string | null;
}) {
  //
  // 1. CLASSIFICATION
  //
  const classification = classifyMemory(content);

  //
  // 2. LIFECYCLE EVALUATION
  //
  const lifecycle = evaluateMemoryLifecycle(content);

  //
  // 3. OVERSIGHT (final decision)
  //
  const oversight = ethicalOversight(classification, lifecycle);

  if (!oversight.allowed || !oversight.store) {
    return { blocked: true, reason: "Ethical oversight restriction." };
  }

  //
  // 4. IMPORTANCE
  //
  const importance =
    oversight.finalKind === "fact" ? 1 :
    oversight.finalKind === "identity" ? 2 :
    oversight.finalKind === "value" ? 3 :
    oversight.finalKind === "insight" ? 3 :
    4; // fallback for notes

  //
  // 5. INSERT NEW MEMORY
  //
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      content,
      title,
      kind: oversight.finalKind,     // fact | identity | value | insight | note
      importance,
      workspace_id,
      sensitivity_score: classification.sensitivity,
      emotional_weight: classification.emotionalWeight,
      requires_review: oversight.requiresReview,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

