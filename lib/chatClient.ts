// lib/chatClient.ts

function normalizeApiBase(raw?: string) {
  // Prefer www (avoids apex→www redirects that can break CORS preflight)
  const fallback = "https://www.moralclarity.ai/api";
  if (!raw) return fallback;
  // If someone configured apex by mistake, rewrite it
  return raw.replace("https://moralclarity.ai", "https://www.moralclarity.ai");
}

// ✅ Single source of truth
export const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatFilters = string[];

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
