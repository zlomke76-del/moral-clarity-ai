// lib/chat/image-gen.ts
import OpenAI from 'openai';

const API_KEY = process.env.OPENAI_API_KEY || '';

if (!API_KEY) {
  console.warn(
    '[image-gen] OPENAI_API_KEY is not set; image generation requests will fail until it is configured.'
  );
}

// Shared OpenAI client for image generation
const client = new OpenAI({
  apiKey: API_KEY,
});

// Use a **valid image model**, separate from the chat model
export const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

export type ImageSize = '256x256' | '512x512' | '1024x1024';

/**
 * Generate a single image and return its URL.
 *
 * This is Node-only and used by Solace’s backend.
 */
export async function generateImage(
  prompt: string,
  size: ImageSize = '1024x1024'
): Promise<string> {
  if (!API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured for image generation');
  }

  const trimmed = (prompt || '').trim();
  if (!trimmed) {
    throw new Error('Image generation prompt is empty');
  }

  const res = await client.images.generate({
    model: IMAGE_MODEL,
    prompt: trimmed,
    n: 1,
    size,
  });

  const url = res.data?.[0]?.url;
  if (!url) {
    throw new Error('No image URL returned from OpenAI');
  }

  return url;
}
