// app/api/chat/modules/memory-writer.ts
// -------------------------------------------------------------
// Writes memory always using the userKey passed by route.ts
// No authentication, no canonical lookup here.
// -------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";

export async function writeMemory(
  userKey: string,
  userMessage: string,
  assistantReply: string
) {
  try {
    if (!userKey) {
      console.warn("[memory-writer] missing userKey — skipping write");
      return;
    }

    // Basic safety guard
    if (!userMessage || !assistantReply) {
      console.warn("[memory-writer] missing message or reply — skipping");
      return;
    }

    // Insert memory entry
    await supabaseEdge.from("user_memories").insert({
      user_key: userKey,              // FINAL + CORRECT
      kind: "interaction",
      content: userMessage,
      source: "user",
      created_at: new Date().toISOString(),
    });

    // Insert assistant memory (optional but symmetrical)
    await supabaseEdge.from("user_memories").insert({
      user_key: userKey,
      kind: "assistant_reply",
      content: assistantReply,
      source: "assistant",
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[memory-writer] Failed to write memory:", err);
  }
}
