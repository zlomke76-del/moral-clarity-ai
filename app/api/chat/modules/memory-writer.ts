// app/api/chat/modules/memory-writer.ts
//--------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";

export async function writeMemory(
  userKey: string | null,
  userMessage: string,
  assistantMessage: string
) {
  if (!userKey) {
    console.warn("[memory-writer] No userKey → skipping persistence.");
    return;
  }

  try {
    const { error } = await supabaseEdge.from("user_memories").insert({
      user_key: userKey,
      user_message: userMessage,
      assistant_message: assistantMessage,
    });

    if (error) console.error("[memory-writer] insert failed", error);
  } catch (err) {
    console.error("[memory-writer] fatal error", err);
  }
}

