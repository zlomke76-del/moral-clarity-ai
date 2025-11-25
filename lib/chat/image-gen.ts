// lib/chat/image-gen.ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Dedicated image model (separate from chat model)
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

/**
 * Generate an image and return a browser-usable URL.
 *
 * - If OpenAI returns a direct URL, we use it.
 * - If OpenAI returns base64 (b64_json), we wrap it in a data: URL.
 */
export async function generateImage(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured for image generation');
  }

  const resp = await client.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size: '1024x1024',
    // NOTE: we do NOT pass `response_format` to avoid 400 errors.
    // We'll handle both URL and base64 outputs below.
  } as any);

  const first = (resp as any)?.data?.[0] ?? {};

  // Case 1: direct URL from OpenAI
  if (first.url && typeof first.url === 'string') {
    return first.url as string;
  }

  // Case 2: base64 payload → convert to data URL so the browser can render it
  if (first.b64_json && typeof first.b64_json === 'string') {
    const b64 = first.b64_json as string;
    return `data:image/png;base64,${b64}`;
  }

  throw new Error('No image URL or base64 payload returned from OpenAI');
}
