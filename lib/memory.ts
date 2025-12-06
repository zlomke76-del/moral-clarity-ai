// lib/memory.ts

import { createClient } from "@supabase/supabase-js";
import { consolidateMemory } from "./memory-intelligence";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type MemoryPurpose =
  | "fact"
  | "preference"
  | "context"
  | "note"
  | "episode"
  | "other";

export async function remember({
  user_key,
  content,
  title,
  purpose,
  workspace_id,
}: {
  user_key: string;
  content: string;
  title?: string | null;
  purpose?: MemoryPurpose | null;
  workspace_id?: string | null;
}) {
  // 1. Check for consolidation opportunities
  const consolidation = await consolidateMemory(user_key, content);
  if (consolidation?.mergedInto) {
    return { mergedInto: consolidation.mergedInto };
  }

  // 2. Base importance mapping
  const importance = 
    purpose === "fact"
      ? 1
      : purpose === "context"
      ? 2
      : purpose === "preference"
      ? 3
      : 4;

  // 3. Insert memory
  const { data, error } = await supabase
    .from("user_memories")
    .insert({
      user_key,
      content,
      title,
      kind: purpose || "note",
      importance,
      workspace_id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}


