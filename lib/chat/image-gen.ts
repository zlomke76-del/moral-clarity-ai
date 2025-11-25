// lib/chat/image-gen.ts
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'node:buffer';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use a dedicated image model, not the chat MODEL
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

// Supabase storage for durable URLs (fallback when OpenAI URLs are missing)
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_IMAGE_BUCKET =
  process.env.SUPABASE_IMAGE_BUCKET || 'generated_images';

function createSupabaseServiceClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

type ImageSize = '256x256' | '512x512' | '1024x1024';

async function generateImageViaUrl(
  prompt: string,
  size: ImageSize
): Promise<string | null> {
  const res = await client.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size,
    response_format: 'url',
  });

  const url = res.data?.[0]?.url;
  return url ?? null;
}

async function generateImageViaB64AndUpload(
  prompt: string,
  size: ImageSize
): Promise<string> {
  const res = await client.images.generate({
    model: IMAGE_MODEL,
    prompt,
    n: 1,
    size,
    response_format: 'b64_json',
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('No image bytes (b64_json) returned from OpenAI');
  }

  const supabase = createSupabaseServiceClient();

  const buffer = Buffer.from(b64, 'base64');
  const fileName = `img_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}.png`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_IMAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType: 'image/png',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload generated image: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(SUPABASE_IMAGE_BUCKET)
    .getPublicUrl(fileName);

  if (!data?.publicUrl) {
    throw new Error('Failed to obtain public URL for generated image');
  }

  return data.publicUrl;
}

/**
 * Generate an image and return a browser-viewable URL.
 *
 * Strategy:
 * 1) Ask OpenAI for a direct URL.
 * 2) If that fails, ask for b64_json, upload to Supabase, and return a public URL.
 */
export async function generateImage(
  prompt: string,
  size: ImageSize = '1024x1024'
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured for image generation');
  }

  const cleanPrompt = prompt?.trim();
  if (!cleanPrompt) {
    throw new Error('Empty prompt for image generation');
  }

  // First attempt: direct URL from OpenAI
  const url = await generateImageViaUrl(cleanPrompt, size);
  if (url) return url;

  // Fallback: get bytes and persist via Supabase
  return generateImageViaB64AndUpload(cleanPrompt, size);
}

// Export the model name in case routes/UI want to expose it
export const IMAGE_MODEL_NAME = IMAGE_MODEL;
