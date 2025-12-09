// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// FACT memory writer — Fully ASCII-SAFE (Prevents DB Unicode drift)
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

// Same sanitizer used across all Solace modules
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": '"',
    "”": '"',
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  let out = input;
  for (const bad of Object.keys(replacements)) {
    out = out.split(bad).join(replacements[bad]);
  }

  // Replace non-ASCII (>255)
  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

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

    //----------------------------------------------------------
    // SANITIZE message + reply BEFORE constructing JSON object
    //----------------------------------------------------------
    const safeUser = sanitizeASCII(userMessage);
    const safeAssistant = sanitizeASCII(assistantReply);

    //----------------------------------------------------------
    // Build memory JSON and sanitize AGAIN after stringify
    //----------------------------------------------------------
    const rawMemory = {
      user: safeUser,
      assistant: safeAssistant,
      ts: nowIso,
    };

    // JSON.stringify can reintroduce Unicode escapes — sanitize again
    const memoryContent = sanitizeASCII(JSON.stringify(rawMemory));

    //----------------------------------------------------------
    // Safe Supabase client (Node runtime)
    //----------------------------------------------------------
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: () => undefined,
          set: () => {},
          remove: () => {},
        },
      }
    );

    //----------------------------------------------------------
    // Insert sanitized record
    //----------------------------------------------------------
    const insertPayload = {
      canonical_user_key: canonicalUserKey,
      user_key: canonicalUserKey,
      kind: "fact",
      content: memoryContent,
      weight: 1.0,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { error } = await supabase
      .from("user_memories")
      .insert(insertPayload);

    if (error) {
      console.error("[writeMemory] Insert failed:", error, {
        attemptedPayload: insertPayload,
      });
      return;
    }

    console.log(
      "[writeMemory] FACT memory stored for:",
      canonicalUserKey
    );
  } catch (err) {
    console.error("[writeMemory] Unexpected failure:", err);
  }
}

