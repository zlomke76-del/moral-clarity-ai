// lib/chatClient.ts

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatFilters = string[];

// Use env in Studio project if set, else canonical domain
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://www.moralclarity.ai/api";

/**
 * Call the chat API (non-stream JSON).
 * For streaming, we can add a second helper later if needed.
 */
export async function chat(
  messages: ChatMessage[],
  opts?: {
    filters?: ChatFilters;
    stream?: boolean; // default false here
    contextId?: string;
    lastMode?: string;
  }
) {
  const payload = {
    messages,
    filters: opts?.filters ?? [],
    stream: Boolean(opts?.stream),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (opts?.contextId) headers["X-Context-Id"] = opts.contextId;
  if (opts?.lastMode) headers["X-Last-Mode"] = opts.lastMode;

  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    // no credentials needed for cross-origin API
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat API ${res.status}: ${text || res.statusText}`);
  }

  // shape from your route: { text, model, mode, confidence, ... }
  return (await res.json()) as {
    text: string;
    model: string;
    mode: string;
    confidence?: number;
    signals?: unknown;
    filters?: string[];
  };
}
