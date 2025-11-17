// lib/chat/image-gen.ts

import { getOpenAI } from '@/lib/openai';

/**
 * Simple image generation helper used by Solace.
 * Returns a public URL for the generated image.
 */
export async function generateImage(prompt: string): Promise<string> {
  const client = await getOpenAI();

  const model =
    process.env.OPENAI_VISION_MODEL ||
    process.env.OPENAI_IMAGE_MODEL ||
    'gpt-image-1';

  const res = await client.images.generate({
    model,
    prompt,
    n: 1,
    size: '1024x1024',
  });

  const url = res.data?.[0]?.url;
  if (!url) {
    throw new Error('Image generation did not return a URL');
  }

  return url;
}
