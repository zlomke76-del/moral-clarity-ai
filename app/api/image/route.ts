// app/api/image/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateImage, IMAGE_MODEL_NAME } from '@/lib/chat/image-gen';

const STATIC_ALLOWED_ORIGINS = [
  'https://moralclarity.ai',
  'https://www.moralclarity.ai',
  'https://studio.moralclarity.ai',
  'https://studio-founder.moralclarity.ai',
  'https://moralclarityai.com',
  'https://www.moralclarityai.com',
  'http://localhost:3000',
];

const ENV_ALLOWED_ORIGINS = (process.env.MCAI_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_SET = new Set<string>([
  ...STATIC_ALLOWED_ORIGINS,
  ...ENV_ALLOWED_ORIGINS,
]);

function pickAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try {
    if (ALLOWED_SET.has(origin)) return origin;
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (host.endsWith('.moralclarity.ai') || host === 'moralclarity.ai')
      return origin;
    if (host.endsWith('.moralclarityai.com') || host === 'moralclarityai.com')
      return origin;
  } catch {
    // ignore malformed origin
  }
  return null;
}

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set('Vary', 'Origin');
  h.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  h.set('Access-Control-Max-Age', '86400');
  if (origin) h.set('Access-Control-Allow-Origin', origin);
  return h;
}

export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get('origin'));
  const headers = corsHeaders(origin);

  try {
    const body = await req.json().catch(() => ({}));
    const prompt = String(body?.prompt ?? '').trim();
    const size = (body?.size as string | undefined) || '1024x1024';

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400, headers }
      );
    }

    // Delegate to shared generator (OpenAI + Supabase fallback)
    const url = await generateImage(prompt, size as any);

    return NextResponse.json(
      {
        url,
        model: IMAGE_MODEL_NAME,
      },
      { headers }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || String(e) },
      { status: 500, headers }
    );
  }
}
