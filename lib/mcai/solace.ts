// lib/mcai/solace.ts
/* Minimal Solace adapter so builds succeed with or without a Solace backend.
   - withTimeout: Promise timeout wrapper
   - solaceNonStream: uses Solace when SOLACE_* envs exist; otherwise falls back to OpenAI
   - solaceStream: placeholder (throws) — route only calls it if Solace envs are set
*/

import type OpenAI from 'openai';
import { getOpenAI } from '@/lib/openai';

export function withTimeout<T>(p: Promise<T>, ms = 12_000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Request timed out')), ms);
    p.then(v => { clearTimeout(t); resolve(v); })
     .catch(err => { clearTimeout(t); reject(err); });
  });
}

type Msg = { role: 'system' | 'user' | 'assistant'; content: string };

export async function solaceNonStream(opts: {
  system?: string;
  messages: Msg[];
  temperature?: number;
  mode?: string;
  userId?: string | null;
  userName?: string | null;
  entitlements?: Record<string, unknown>;
}): Promise<string> {
  const { system, messages, temperature = 0.2 } = opts;

  // If Solace env is present, attempt a direct call (non-stream)
  const url = process.env.SOLACE_API_URL;
  const key = process.env.SOLACE_API_KEY;

  if (url && key) {
    try {
      const resp = await fetch(`${url.replace(/\/+$/, '')}/v1/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          system,
          messages,
          temperature,
          mode: opts.mode || 'default',
          user_id: opts.userId || undefined,
          user_name: opts.userName || undefined,
          entitlements: opts.entitlements || undefined,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        throw new Error(`Solace error: ${resp.status} ${text}`);
      }
      const data = await resp.json().catch(() => ({}));
      const out = (data?.text ?? data?.message ?? '').toString().trim();
      if (out) return out;
      // fall through to OpenAI if Solace returned empty
    } catch {
      // silent fallback below
    }
  }

  // Fallback: use OpenAI
  const openai: OpenAI = await getOpenAI();
  const input = [
    system ? `system: ${system}` : '',
    ...messages.map(m => `${m.role}: ${m.content}`),
  ].filter(Boolean).join('\n');

  const r = await openai.responses.create({
    model: process.env.OPENAI_FALLBACK_MODEL || 'gpt-4o-mini',
    input,
    temperature,
    max_output_tokens: 800,
  } as any);

  return ((r as any).output_text || '').trim();
}

// Only used when actual Solace streaming is enabled; safe placeholder for builds.
// Use `any` return type to avoid requiring DOM `ReadableStream` types in TS.
export async function solaceStream(_opts: unknown): Promise<any> {
  throw new Error('solaceStream is not configured (missing SOLACE_API_URL / SOLACE_API_KEY).');
}
