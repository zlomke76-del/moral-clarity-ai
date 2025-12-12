// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// MEMORY WRITER — PHASE A (PLAINTEXT, OPERATIONAL)
// Writes ONLY intentional, authorized memory to memory.memories
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

// ------------------------------------------------------------
// ASCII SANITIZER (DB + MODEL SAFE)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// WRITE MEMORY
// ------------------------------------------------------------
export async function writeMemory(
  canonicalUserKey: string | null,
  userMessage: string,
  assistantReply: string
) {
  if (!canonicalUserKey) {
    console.warn("[MEMORY-WRITE] skipped — no canonicalUserKey");
    return;
  }

  const nowIso = new Date().toISOString();

  // ----------------------------------------------------------
  // SANITIZE INPUTS
  // ----------------------------------------------------------
  const safeUser = sanitizeASCII(userMessage);
  const safeAssistant = sanitizeASCII(assistantReply);

  const rawMemory = {
    user: safeUser,
    assistant: safeAssistant,
    ts: nowIso,
  };

  const content = sanitizeASCII(JSON.stringify(rawMemory));

  // ----------------------------------------------------------
  // DIAGNOSTIC — WRITE INTENT
  // ----------------------------------------------------------
  console.log("[MEMORY-WRITE] intent", {
    schema: "memory",
    table: "memories",
    userKey: canonicalUserKey,
    bytes: content.length,
  });

  // ----------------------------------------------------------
  // SUPABASE CLIENT (NODE)
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // INSERT (SCHEMA-QUALIFIED)
  // ----------------------------------------------------------
  const { error } = await supabase
    .from("memory.memories")
    .insert({
      user_id: canonicalUserKey,
      memory_type: "fact",
      content,
      is_active: true,
      created_at: nowIso,
    });

  // ----------------------------------------------------------
  // DIAGNOSTICS
  // ----------------------------------------------------------
  if (error) {
    console.error("[MEMORY-WRITE] FAILED", {
      code: error.code,
      message: error.message,
      hint: error.hint,
    });
    return;
  }

  console.log("[MEMORY-WRITE] SUCCESS → memory.memories", {
    userKey: canonicalUserKey,
    ts: nowIso,
  });
}
