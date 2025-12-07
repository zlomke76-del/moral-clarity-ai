// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Writes only FACT memories into user_memories
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

    const insertPayload = {
      user_key: canonicalUserKey,  // Must match supabase column
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
      console.error("[writeMemory] Supabase insert error:", error);
    } else {
      console.log("[writeMemory] FACT memory saved for:", canonicalUserKey);
    }
  } catch (err) {
    console.error("[writeMemory] unexpected failure:", err);
  }
}

