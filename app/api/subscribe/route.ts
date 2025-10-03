// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Force server runtime and disable caching
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- CONFIG ---
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Small helper to build CORS headers
const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Vary': 'Origin',
  'Content-Type': 'application/json; charset=utf-8',
};

// Validate payload
const BodySchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

// Preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/subscribe
export async function POST(req: Request) {
  try {
    // Parse & validate
    const json = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { email } = parsed.data;

    // Check env
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Server not configured (Supabase env missing).' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Server-side Supabase client (Service Role — do not expose on client)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Ensure you have a table named `subscribers` with a unique "email" column.
    // This upsert is idempotent: repeat submissions succeed without error.
    const { error } = await supabase
      .from('subscribers')
      .upsert(
        { email, created_at: new Date().toISOString() },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    // Some Postgres setups throw unique violation instead of upsert. Treat as success.
    if (error && error.code !== '23505') {
      return NextResponse.json(
        { ok: false, error: error.message ?? 'Database error' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
