// lib/solace-engine/solace-adapter.ts

/**
 * Solace Adapter
 *
 * A clean, isolated gateway for calling the Solace backend.
 * Provides:
 *  - nonStream()
 *  - stream()
 *  - unified error normalization
 *  - retry protection for 502/503/connection resets
 */

export interface SolaceCallPayload {
  mode: string;
  userId: string | null;
  userName: string | null;
  system: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  max_output_tokens?: number;

  // optional context blocks
  context?: {
    research: string | null;
    news: string | null;
    memory: string | null;
  };

  context_mode?: 'authoritative' | 'none';
  stream?: boolean;
}

export interface SolaceResponse {
  text: string;
  model: string;
}

const SOLACE_URL = process.env.SOLACE_API_URL || '';
const SOLACE_KEY = process.env.SOLACE_API_KEY || '';

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${SOLACE_KEY}`,
};

// Retry conditions
function isTransientError(status: number, message: string) {
  if (status === 502 || status === 503) return true;
  if (/ECONNRESET|ETIMEDOUT|network|fetch failed/i.test(message)) return true;
  return false;
}

// Base fetch wrapper
async function sendToSolace(payload: any, isStream: boolean): Promise<Response> {
  const body = JSON.stringify({ ...payload, stream: isStream });

  const r = await fetch(SOLACE_URL, {
    method: 'POST',
    headers: HEADERS,
    body,
  });

  return r;
}

// Retry wrapper
async function withRetries<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 300
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries <= 0) throw err;

    const msg = String(err?.message || err);
    const transient = isTransientError((err as any)?.status || 0, msg);

    if (!transient) throw err;

    await new Promise((res) => setTimeout(res, delayMs));
    return withRetries(fn, retries - 1, delayMs * 2);
  }
}

/* ============================================================
   NON-STREAM CALL
   ============================================================ */
export async function solaceNonStream(
  payload: SolaceCallPayload
): Promise<SolaceResponse> {
  return withRetries(async () => {
    const r = await sendToSolace(payload, false);

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      const err = new Error(`Solace error ${r.status}: ${text}`);
      (err as any).status = r.status;
      throw err;
    }

    const ct = r.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const j: any = await r.json().catch(() => ({}));
      return {
        text: String(j.text ?? j.output ?? j.data ?? ''),
        model: String(j.model ?? 'solace'),
      };
    }

    return {
      text: await r.text(),
      model: 'solace',
    };
  });
}

/* ============================================================
   STREAM CALL
   ============================================================ */
export async function solaceStream(
  payload: SolaceCallPayload
): Promise<ReadableStream<Uint8Array>> {
  return withRetries(async () => {
    const r = await sendToSolace(payload, true);

    if (!r.ok || !r.body) {
      const text = await r.text().catch(() => '');
      const err = new Error(`Solace stream error ${r.status}: ${text}`);
      (err as any).status = r.status;
      throw err;
    }

    return r.body as ReadableStream<Uint8Array>;
  });
}
