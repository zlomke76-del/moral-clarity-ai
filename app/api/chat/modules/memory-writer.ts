// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Writes FACT memories into user_memories
// canonicalUserKey = normalized email (single source of truth)
// ------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";

export async function writeMemory(
  canonicalUserKey: string,
  userMessage: string,
  assistantReply: string
) {
  try {
    if (!canonicalUserKey) {
      console.warn("[writeMemory] Missing canonicalUserKey — skipping write.");
      return;
    }

    // Combine user + assistant exchange into a memory entry
    const memoryContent = JSON.stringify({
      user: userMessage,
      assistant: assistantReply,
      ts: new Date().toISOString(),
    });

    // IMPORTANT: Must match Supabase schema exactly
    const insertPayload = {
      canonical_user_key: canonicalUserKey,   // ✅ FIXED COLUMN NAME
      kind: "fact",
      content: memoryContent,
      weight: 1.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseEdge
      .from("user_memories")
      .insert(insertPayload);

    if (error) {
      console.error("[writeMemory] Supabase insert error:", error, {
        attemptedPayload: insertPayload,
      });
    } else {
      console.log("[writeMemory] FACT memory saved for:", canonicalUserKey);
    }
  } catch (err) {
    console.error("[writeMemory] unexpected failure:", err);
  }
}

