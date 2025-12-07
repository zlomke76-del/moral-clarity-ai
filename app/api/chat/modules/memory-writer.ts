// app/api/chat/modules/memory-writer.ts
// -----------------------------------------------------------------------------
// Writes short-form memory records to user_memories
// ALWAYS keyed by canonical_user_key (email).
// This ensures:
//   • cross-device continuity
//   • subscription pause/resume integrity
//   • no user duplication
//   • correct read/write symmetry with assembleContext.ts
// -----------------------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";
import { getCanonicalUserKey } from "@/lib/supabase/getCanonicalUserKey";

export async function writeMemory(
  overrideUserKey: string | null,
  userMessage: string,
  assistantReply: string
) {
  try {
    // 1. Get canonical email identity
    const { canonicalKey } = await getCanonicalUserKey();

    // If developer forced a different key → use it
    const userKey = overrideUserKey || canonicalKey || "guest";

    // 2. Construct memory payload — short factual memory only
    const payload = {
      canonical_user_key: userKey,
      kind: "fact", // could expand later for tags
      content: `${userMessage}\n---\n${assistantReply}`,
      title: userMessage.slice(0, 80),
      weight: 1.0,
    };

    // 3. Insert into Supabase
    const { error } = await supabaseEdge
      .from("user_memories")
      .insert(payload);

    if (error) {
      console.error("[writeMemory] Supabase insert error:", error);
    }

  } catch (err) {
    console.error("[writeMemory] Fatal error:", err);
  }
}

