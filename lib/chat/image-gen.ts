// lib/chat/image-gen.ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use a **valid image model**, separate from the chat MODEL
const IMAGE_MODEL =
  process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

export async function generateImage(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured for image generation');
  }

  const res = await client.images.generate({
    model: IMAGE_MODEL,   // <- NOT gpt-4o-mini
    prompt,
    n: 1,
    size: '1024x1024',
  });

  const url = res.data?.[0]?.url;
  if (!url) {
    throw new Error('No image URL returned from OpenAI');
  }

  return url;
}
