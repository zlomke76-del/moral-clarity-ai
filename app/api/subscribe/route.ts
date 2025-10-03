import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN ?? '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') ?? '';

    let email: string | null = null;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      email = (body?.email ?? '').trim();
    } else {
      // Handle Webflow’s default form encoding
      const form = await req.formData();
      email =
        (form.get('email') as string) ||
        (form.get('Newsletter-Email') as string) ||
        (form.get('Newsletter Email') as string) ||
        '';
      email = email.trim();
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert; treat duplicates as success (idempotent)
    const { error } = await supabase.from('subscribers').insert({ email });
    const isDup =
      error?.code === '23505' ||
      (error?.message ?? '').toLowerCase().includes('duplicate');

    if (error && !isDup) {
      return NextResponse.json(
        { error: error.message ?? 'Insert failed' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
