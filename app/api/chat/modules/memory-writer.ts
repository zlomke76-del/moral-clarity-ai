// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// MEMORY WRITER — PHASE A (PLAINTEXT, OPERATIONAL)
// Writes ONLY explicit / authorized memories to memory.memories
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type MemoryWriteInput = {
  userId: string;
  email: string;
  workspaceId: string | null;
  memoryType: "fact" | "identity";
  source: "explicit" | "founder";
  content: string;
};

// ------------------------------------------------------------
// ASCII Sanitizer (hard safety)
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
  for (const k in replacements) out = out.split(k).join(replacements[k]);

  return out
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// ------------------------------------------------------------
// Writer
// ------------------------------------------------------------
export async function writeMemory(input: MemoryWriteInput) {
  try {
    const {
      userId,
      email,
      workspaceId,
      memoryType,
      source,
      content,
    } = input;

    const now = new Date().toISOString();

    const sanitizedContent = sanitizeASCII(content);

    console.log("[MEMORY-WRITE] intent", {
      schema: "memory",
      table: "memories",
      userId,
      memoryType,
      source,
      bytes: sanitizedContent.length,
    });

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

    const { error } = await supabase
      // ✅ CORRECT schema-qualified reference
      .from("memory.memories")
      .insert({
        user_id: userId,
        email,
        workspace_id: workspaceId,
        memory_type: memoryType,
        source,
        content: sanitizedContent,
        is_active: true,
        created_at: now,
        updated_at: now,
      });

    if (error) {
      console.error("[MEMORY-WRITE] FAILED", {
        code: error.code,
        message: error.message,
        hint: error.hint,
      });
      return;
    }

    console.log("[MEMORY-WRITE] SUCCESS", {
      userId,
      memoryType,
    });
  } catch (err) {
    console.error("[MEMORY-WRITE] EXCEPTION", err);
  }
}
