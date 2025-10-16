// lib/chatClient.ts

function normalizeApiBase(raw?: string) {
<<<<<<< HEAD
  // Use same-origin by default to avoid CORS entirely
  const fallback = "/api";
  if (!raw) return fallback;
  // If someone configured apex by mistake, rewrite to www
  return raw.replace("https://moralclarity.ai", "https://www.moralclarity.ai");
}

// ✅ Single source of truth (export if other modules need it)
=======
  // Use same-origin by default to avoid CORS
  const fallback = "/api";
  if (!raw) return fallback;

  try {
    // If the env is absolute, strip host so we stay same-origin
    const u = new URL(raw);
    return u.pathname || fallback; // e.g. https://moralclarity.ai/api -> /api
  } catch {
    return raw.startsWith("/") ? raw : fallback;
  }
}

>>>>>>> 708c0a7 (fix: remove duplicate API_BASE; force same-origin /api)
export const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL);

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatFilters = string[];

<<<<<<< HEAD
/**
 * Call the chat API (non-stream JSON).
 */
=======
/** Call the chat API (non-stream JSON). */
>>>>>>> 708c0a7 (fix: remove duplicate API_BASE; force same-origin /api)
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
