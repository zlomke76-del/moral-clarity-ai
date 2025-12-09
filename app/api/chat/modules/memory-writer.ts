// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Unified FACT memory writer for MCAI
// Node-runtime safe version — avoids Edge ByteString limits
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

export async function writeMemory(
  canonicalUserKey: string | null,
  userMessage: string,
  assistantReply: string
) {
  try {
    if (!canonicalUserKey) {
      console.warn("[writeMemory] Skipped — no canonicalUserKey.");
      return;
    }

    const nowIso = new Date().toISOString();

    const memoryContent = JSON.stringify({
      user: userMessage,
      assistant: assistantReply,
      ts: nowIso,
    });

    // ⭐ Node-safe Supabase client (NOT Edge!)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get() {},
          set() {},
          remove() {},
        },
      }
    );

    const insertPayload = {
      canonical_user_key: canonicalUserKey,
      user_key: canonicalUserKey,
      kind: "fact",
      content: memoryContent, // full unicode safe
      weight: 1.0,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { error } = await supabase
      .from("user_memories")
      .insert(insertPayload);

    if (error) {
      console.error("[writeMemory] Insert failed:", error);
      return;
    }

    console.log("[writeMemory] FACT memory stored for:", canonicalUserKey);
  } catch (err) {
    console.error("[writeMemory] Unexpected failure:", err);
  }
}

