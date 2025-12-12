// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Phase A Memory Writer — EXPLICIT ONLY
// Writes to schema: memory.memories
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";

export type MemoryWriteInput = {
  userId: string;
  email: string;
  workspaceId: string | null;
  memoryType: "fact" | "identity";
  source: "explicit" | "founder";
  content: string;
};

export async function writeMemory(input: MemoryWriteInput) {
  const {
    userId,
    email,
    workspaceId,
    memoryType,
    source,
    content,
  } = input;

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

  console.log("[MEMORY-WRITE] intent", {
    schema: "memory",
    table: "memories",
    userId,
    memoryType,
    source,
    bytes: content.length,
  });

  const { error } = await supabase
    .schema("memory")               // ✅ THIS IS THE FIX
    .from("memories")
    .insert({
      user_id: userId,
      email,
      workspace_id: workspaceId,
      memory_type: memoryType,
      source,
      content,
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
}
