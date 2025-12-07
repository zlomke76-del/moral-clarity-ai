// app/api/chat/modules/memory-writer.ts
// -------------------------------------------------------------
// Writes long-term factual memories for Solace
// Canonical user identity (email) is required
// -------------------------------------------------------------

import { supabaseEdge } from "@/lib/supabase/edge";

// -------------------------------------------------------------
// CLEANING UTILITIES
// -------------------------------------------------------------

// Remove system-y garbage, hallucinated wrappers, XML, boilerplate, etc.
function clean(text: string): string {
  if (!text) return "";

  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(assistant|system):\s*/i, "")
    .replace(/^\[.*?\]\s*/g, "")
    .replace(/<\/*analysis>/gi, "")
    .replace(/<\/*thinking>/gi, "")
    .replace(/\*\*/g, "")
    .trim();
}

// Summarize the assistant reply into a single stable “memory fact”
function distillFact(userMsg: string, assistantReply: string): string {
  const msg = clean(userMsg);
  const rep = clean(assistantReply);

  if (!msg || !rep) return "";

  // Simple summarization strategy for memory:
  // Capture what the assistant *learned about the user*.
  // Not a summary of the whole reply.
  if (/my name/i.test(msg)) {
    const m = rep.match(/name\s+is\s+([A-Za-z0-9 ._-]+)/i);
    if (m) return `User's name is ${m[1]}.`;
    return "User shared their name.";
  }

  // Generic fallback:
  return `User said: "${msg}". Assistant responded: "${rep.slice(0, 180)}..."`;
}

// -------------------------------------------------------------
// WRITE MEMORY
// -------------------------------------------------------------
export async function writeMemory(
  userKey: string,
  userMessage: string,
  assistantReply: string
) {
  try {
    if (!userKey || userKey === "guest") {
      // Guests do not write memory
      return;
    }

    const fact = distillFact(userMessage, assistantReply);

    if (!fact || fact.length < 6) {
      console.warn("[memory-writer] Skipped (too small):", fact);
      return;
    }

    const { error } = await supabaseEdge.from("user_memories").insert({
      user_key: userKey,
      content: fact,
    });

    if (error) {
      console.error("[memory-writer] insert error:", error);
    }
  } catch (err) {
    console.error("[memory-writer] fatal:", err);
  }
}

