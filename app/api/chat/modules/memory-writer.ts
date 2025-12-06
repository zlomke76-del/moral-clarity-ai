// app/api/chat/modules/memory-writer.ts
import { createClient } from "@supabase/supabase-js";

// Edge-safe Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: { persistSession: false }
  }
);

/**
 * Quick classifier to detect if a message should be remembered.
 * Hybrid = AI decides + user can explicitly command.
 */
function shouldRemember(userMsg: string, assistantReply: string): boolean {
  const msg = userMsg.toLowerCase();

  // Explicit user commands
  if (
    msg.includes("remember this") ||
    msg.includes("save this") ||
    msg.includes("don't forget") ||
    msg.includes("you should remember") ||
    msg.includes("store this")
  ) {
    return true;
  }

  // Implicit cues (name, identity, preference, personal detail)
  const implicitPatterns = [
    /my name is/i,
    /i prefer/i,
    /i like/i,
    /i love/i,
    /i don’t like/i,
    /my birthday/i,
    /my goal/i,
    /my wife/i,
    /my husband/i,
    /my kids/i,
    /i work at/i,
    /i live in/i,
  ];

  if (implicitPatterns.some((p) => p.test(userMsg))) return true;

  // No signal → ignore
  return false;
}

/**
 * Create a structured 3–5 sentence memory summary.
 */
function summarizeForMemory(userMsg: string, assistantReply: string): string {
  return (
    `User said: ${userMsg.trim()}\n` +
    `Solace responded: ${assistantReply.trim()}\n` +
    `Summary: This exchange included personally meaningful information that may help in future conversations.`
  );
}

/**
 * Write memory to Supabase
 */
export async function writeMemory(
  userKey: string,
  userMsg: string,
  assistantReply: string
) {
  if (!userKey) return;
  if (!shouldRemember(userMsg, assistantReply)) return;

  const content = summarizeForMemory(userMsg, assistantReply);

  const { error } = await supabase.from("user_memories").insert({
    user_key: userKey,
    kind: "fact",
    content,
    weight: 1,
    title: "User memory",
    tags: [],
    importance: 1,
    source_channel: "conversation",
  });

  if (error) {
    console.error("[memory-writer] failed insert:", error);
  }
}


