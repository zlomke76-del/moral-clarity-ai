// lib/chatClient.ts

function normalizeApiBase(raw?: string) {
  // Use same-origin by default to avoid CORS entirely
  const fallback = "/api";
  if (!raw) return fallback;
  // If someone configured apex by mistake, rewrite to www
  return raw.replace("https://moralclarity.ai", "https://www.moralclarity.ai");
}

// ✅ Single source of truth (export if other modules need it)
export const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatFilters = string[];

/**
 * Call the chat API (non-stream JSON).
 */
export async function chat(
  messages: ChatMessage[],
  opts?: {
    filters?: ChatFilters;
    stream?: boolean;
    contextId?: string;
    lastMode?: string;
  }
) {
  const payload = {
    messages,
    filters: opts?.filters ?? [],
    stream: Boolean(opts?.stream),
  };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts?.contextId) headers["X-Context-Id"] = opts.contextId;
  if (opts?.lastMode) headers["X-Last-Mode"] = opts.lastMode;

  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat API ${res.status}: ${text || res.statusText}`);
  }

  return (await res.json()) as {
    text: string;
    model: string;
    mode: string;
    confidence?: number;
    signals?: unknown;
    filters?: string[];
  };
}
