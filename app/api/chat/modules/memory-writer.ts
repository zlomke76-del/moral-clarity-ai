// app/api/chat/modules/memory-writer.ts
// ------------------------------------------------------------
// Phase A Memory Writer — COOKIE-AWARE, RLS-SAFE
// + Classifier Instrumentation (Advisory)
// ------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { classifyMemoryText } from "@/lib/memory-classifier";

export type MemoryWriteInput = {
  userId: string;
  email: string;
  workspaceId: string | null;
  memoryType: "fact" | "identity";
  source: "explicit" | "founder";
  content: string;
};

export async function writeMemory(
  input: MemoryWriteInput,
  cookieHeader: string
) {
  const {
    userId,
    email,
    workspaceId,
    memoryType,
    source,
    content,
  } = input;

  const startedAt = Date.now();

  // ----------------------------
  // Supabase client (cookie-aware)
  // ----------------------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const m = cookieHeader
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(name + "="));
          return m ? m.split("=")[1] : undefined;
        },
        set() {},
        remove() {},
      },
    }
  );

  // ----------------------------
  // Intent log (pre-classification)
  // ----------------------------
  console.log("[MEMORY-WRITE] intent", {
    schema: "memory",
    table: "memories",
    userId,
    memoryType,
    source,
    bytes: content.length,
    hasWorkspace: Boolean(workspaceId),
  });

  // ----------------------------
  // Classification (advisory)
  // ----------------------------
  let classification:
    | {
        label: string;
        confidence: number;
        provider: string;
      }
    | null = null;

  const classifyStart = Date.now();

  if (content && content.trim().length >= 5) {
    try {
      const result = await classifyMemoryText(content);

      classification = {
        label: result.label,
        confidence: Number(result.confidence?.toFixed(3)) || 0,
        provider: result.provider,
      };
    } catch (err) {
      console.warn("[MEMORY-CLASSIFIER] FAILED", {
        userId,
        error:
          err instanceof Error ? err.message : "unknown classifier error",
      });
    }
  } else {
    console.log("[MEMORY-CLASSIFIER] skipped (input too short)", {
      userId,
      length: content?.length ?? 0,
    });
  }

  const classifyDurationMs = Date.now() - classifyStart;

  // ----------------------------
  // Classification instrumentation
  // ----------------------------
  if (classification) {
    console.log("[MEMORY-CLASSIFIER] result", {
      userId,
      label: classification.label,
      confidence: classification.confidence,
      provider: classification.provider,
      duration_ms: classifyDurationMs,
      is_other: classification.label === "Other",
    });
  }

  // ----------------------------
  // Write memory (unchanged schema)
  // ----------------------------
  const writeStart = Date.now();

  const { error } = await supabase
    .schema("memory")
    .from("memories")
    .insert({
      user_id: userId,
      email,
      workspace_id: workspaceId,
      memory_type: memoryType,
      source,
      content,
      // NOTE:
      // Classification is advisory for now.
      // We are intentionally NOT persisting label yet
      // until taxonomy is finalized.
    });

  const writeDurationMs = Date.now() - writeStart;

  if (error) {
    console.error("[MEMORY-WRITE] FAILED", {
      code: error.code,
      message: error.message,
      hint: error.hint,
      userId,
      memoryType,
      duration_ms: writeDurationMs,
    });
    return;
  }

  // ----------------------------
  // Success instrumentation
  // ----------------------------
  console.log("[MEMORY-WRITE] SUCCESS", {
    userId,
    memoryType,
    write_duration_ms: writeDurationMs,
    total_duration_ms: Date.now() - startedAt,
    classified: Boolean(classification),
  });
}
