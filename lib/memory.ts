// lib/memory.ts
import { createClient } from "@supabase/supabase-js";
import { analyzeMemoryWrite } from "./memory-intelligence";
import { classifyMemoryText } from "./memory-classifier";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

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
  const { data: recent } = await supabase
    .from("user_memories")
    .select("*")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(10);

  const analysis = analyzeMemoryWrite(content, recent ?? []);
  if (!analysis.oversight.store) {
    return { stored: false, reason: "blocked" };
  }

  const semantic = await classifyMemoryText(content);

  const confidence =
    0.4 * analysis.lifecycle.confidence +
    0.3 * semantic.confidence +
    0.3 * (recent?.length ? 0.7 : 0.3);

  const finalKind =
    confidence >= 0.9 ? "fact" : analysis.oversight.finalKind;

  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      title,
      content,
      kind: finalKind,
      importance: finalKind === "fact" ? 5 : 3,
      confidence,
      workspace_id,
      metadata: {
        semantic,
        lifecycle: analysis.lifecycle,
      },
    })
    .select()
    .single();

  if (error) throw error;

  return { stored: true, memory: data, confidence };
}
