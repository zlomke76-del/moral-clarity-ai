// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Unified FACT memory writer for MCAI
// Uses canonical_user_key exclusively.
// Never logs personal identifiers unless needed for debugging.
// ------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";

export async function writeMemory(
  canonicalUserKey: string,
  userMessage: string,
  assistantReply: string
) {
  try {
    // Safety check — Solace must never write without a canonical identity
    if (!canonicalUserKey) {
      console.warn("[writeMemory] Skipped: canonicalUserKey missing.");
      return;
    }

    // Prepare memory content
    const memoryContent = JSON.stringify({
      user: userMessage,
      assistant: assistantReply,
      ts: new Date().toISOString(),
    });

    // FINAL payload (clean, canonical)
    const insertPayload = {
      canonical_user_key: canonicalUserKey,  // ✔ Correct field
      kind: "fact",
      content: memoryContent,
      weight: 1.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into Supabase
    const { error } = await supabaseEdge
      .from("user_memories")
      .insert(insertPayload);

    if (error) {
      console.error("[writeMemory] Insert failed:", error, {
        attemptedPayload: insertPayload,
      });
      return;
    }

    // Clean, non-identifying success message
    console.log("[writeMemory] FACT memory stored successfully.");
  } catch (err) {
    console.error("[writeMemory] Unexpected failure:", err);
  }
}
