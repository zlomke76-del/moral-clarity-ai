// app/api/chat/modules/memory-writer.ts

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

/**
 * Detect whether Solace's reply contains a memory signal.
 * Uses natural language pattern detection — but lightweight.
 */
export function detectMemoryIntent(assistantReply: string) {
  if (!assistantReply) return null;

  const text = assistantReply.toLowerCase();

  // Strong signals — directly says it will remember
  const strongSignals = [
    "i'll remember that",
    "i will remember that",
    "i’ll save that",
    "i will save that",
    "i'll keep that in mind",
    "i will keep that in mind",
    "i'll store that",
    "i will store that",
    "i will recall that",
  ];

  if (strongSignals.some(sig => text.includes(sig))) {
    return true;
  }

  return false;
}

/**
 * Infer factual memories from the user message itself.
 * This is the heart of choice C (Full Inference).
 */
export function extractFactsFromUserMessage(message: string) {
  const facts: { title: string; content: string }[] = [];
  if (!message) return facts;

  const lower = message.toLowerCase();

  // Name / identity patterns
  if (lower.includes("my name is ")) {
    const name = message.split(/my name is/i)[1].trim();
    facts.push({
      title: "User name",
      content: `The user's name is ${name}.`
    });
  }

  if (lower.includes("my wife is ") || lower.includes("my partner is ")) {
    const wife = message.split(/my wife is|my partner is/i)[1].trim();
    facts.push({
      title: "User spouse",
      content: `The user's spouse is ${wife}.`
    });
  }

  if (lower.includes("i own ") || lower.includes("i run ") || lower.includes("my business")) {
    facts.push({
      title: "User business",
      content: message
    });
  }

  // Preferences
  if (lower.includes("i prefer ") || lower.includes("i like ") || lower.includes("my favorite")) {
    facts.push({
      title: "User preference",
      content: message
    });
  }

  return facts;
}

/**
 * Write a factual memory — kind = "fact"
 */
export async function saveFactMemory(
  userKey: string,
  title: string,
  content: string
) {
  await supabase.from("user_memories").insert([
    {
      user_key: userKey,
      kind: "fact",
      title,
      content,
      importance: 5,
      source_channel: "conversation"
    }
  ]);
}

/**
 * Main entry: handle all memory writes for a turn.
 */
export async function processMemoryWrites(userKey: string, userMsg: string, assistantReply: string) {
  // 1. Extract facts from user's message (choice C)
  const inferred = extractFactsFromUserMessage(userMsg);

  for (const fact of inferred) {
    await saveFactMemory(userKey, fact.title, fact.content);
  }

  // 2. If assistant promised to remember → store whole message as fact
  const intent = detectMemoryIntent(assistantReply);

  if (intent) {
    await saveFactMemory(
      userKey,
      "Assistant-confirmed memory",
      assistantReply
    );
  }
}
