// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// MEMORY WRITER — PHASE A (PLAINTEXT, OPERATIONAL)
// Writes ONLY intentional, authorized memory to memory.memories
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

// ------------------------------------------------------------
// ASCII sanitizer (kept for DB/log safety)
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

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// ------------------------------------------------------------
// Memory write contract (explicit, no guessing)
// ------------------------------------------------------------
export type MemoryWriteInput = {
  userId: string;        // auth.users.id
  email: string;         // explicit human anchor
  workspaceId?: string | null;

  memoryType: "identity" | "fact" | "insight" | "decision";
  source: "explicit" | "founder" | "system";

  content: string;
  weight?: number;
};

// ------------------------------------------------------------
// Write memory (NO classification, NO encryption yet)
// ------------------------------------------------------------
export async function writeMemory(input: MemoryWriteInput) {
  try {
    const {
      userId,
      email,
      workspaceId = null,
      memoryType,
      source,
      content,
      weight = 1.0,
    } = input;

    // Hard safety guards
    if (!userId || !email) {
      console.warn("[writeMemory] Skipped — missing userId or email.");
      return;
    }

    if (!content || !content.trim()) {
      console.warn("[writeMemory] Skipped — empty content.");
      return;
    }

    const nowIso = new Date().toISOString();

    // Sanitize content explicitly
    const safeContent = sanitizeASCII(content.trim());
    const safeEmail = sanitizeASCII(email);

    // Supabase client (Node runtime)
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

    // Insert into memory.memories (schema-qualified)
    const { error } = await supabase
      .from("memory.memories")
      .insert({
        user_id: userId,
        email: safeEmail,
        workspace_id: workspaceId,
        memory_type: memoryType,
        source,
        content: safeContent,
        weight,
        created_at: nowIso,
        updated_at: nowIso,
      });

    if (error) {
      console.error("[writeMemory] Insert failed:", error);
      return;
    }

    console.log(
      "[writeMemory] Memory stored:",
      memoryType,
      source,
      userId
    );
  } catch (err) {
    console.error("[writeMemory] Unexpected failure:", err);
  }
}
