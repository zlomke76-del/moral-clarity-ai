// app/api/chat/modules/memory-writer.ts
import { supabaseEdge } from "@/lib/supabase/edge";

function shouldRemember(userMsg: string): boolean {
  const msg = userMsg.toLowerCase();

  if (
    msg.includes("remember this") ||
    msg.includes("save this") ||
    msg.includes("don't forget") ||
    msg.includes("you should remember") ||
    msg.includes("store this")
  ) {
    return true;
  }

  const implicitPatterns = [
    /my name is/i,
    /i prefer/i,
    /i like/i,
    /i love/i,
    /i live in/i,
    /my goal/i,
    /my birthday/i,
    /my wife/i,
    /my husband/i,
    /my kids/i,
  ];

  return implicitPatterns.some((p) => p.test(userMsg));
}

function summarizeForMemory(userMsg: string, assistantReply: string): string {
  return (
    `User said: ${userMsg.trim()}\n` +
    `Solace responded: ${assistantReply.trim()}\n` +
    `Summary: Personal detail noted.`
  );
}

export async function writeMemory(
  userKey: string,
  userMsg: string,
  assistantReply: string
) {
  if (!userKey) return;
  if (!shouldRemember(userMsg)) return;

  const content = summarizeForMemory(userMsg, assistantReply);

  const { error } = await supabaseEdge.from("user_memories").insert({
    user_key: userKey,
    kind: "fact",
    content,
    weight: 1,
    title: "User memory",
    importance: 1,
    source_channel: "conversation",
  });

  if (error) console.error("[memory-writer] failed insert:", error);
}


