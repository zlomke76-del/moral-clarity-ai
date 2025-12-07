// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Unified FACT memory writer for MCAI
// Uses canonical_user_key AND user_key = email.
// - Never writes if not signed in (canonicalUserKey is null).
// - No "guest" facts, no "tim" aliases.
// ------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";

export async function writeMemory(
  canonicalUserKey: string | null,
  userMessage: string,
  assistantReply: string
) {
  try {
    // If there is no canonical user (not signed in) → do NOT write memory
    if (!canonicalUserKey) {
      console.warn(
        "[writeMemory] Skipped FACT memory write — no canonicalUserKey (not signed in)."
      );
      return;
    }

    const nowIso = new Date().toISOString();

    const memoryContent = JSON.stringify({
      user: userMessage,
      assistant: assistantReply,
      ts: nowIso,
    });

    // We populate BOTH user_key and canonical_user_key with the email
    const insertPayload = {
      canonical_user_key: canonicalUserKey, // new canonical column
      user_key: canonicalUserKey,          // keeps mv_unified_memory working
      kind: "fact",
      content: memoryContent,
      weight: 1.0,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { error } = await supabaseEdge
      .from("user_memories")
      .insert(insertPayload);

    if (error) {
      console.error("[writeMemory] Insert failed:", error, {
        attemptedPayload: insertPayload,
      });
      return;
    }

    console.log(
      "[writeMemory] FACT memory stored for canonical user:",
      canonicalUserKey
    );
  } catch (err) {
    console.error("[writeMemory] Unexpected failure:", err);
  }
}
