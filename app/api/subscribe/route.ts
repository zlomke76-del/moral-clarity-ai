// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

// CORS headers (optionally restrict with ALLOWED_ORIGIN env)
const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  // Don’t insert on GET; just tell the world it must be POST.
  return NextResponse.json(
    { ok: false, message: 'Use POST /api/subscribe' },
    { status: 405, headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    // Figure out how the body was sent
    const ct = req.headers.get('content-type') || '';
    let email = '';

    if (ct.includes('application/json')) {
      const body = await req.json().catch(() => ({}));
      email = (body.email || '').trim();
    } else if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
      const form = await req.formData();
      email = String(form.get('email') || '').trim();
    }

    // Basic validation
    const isEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmail) {
      return NextResponse.json(
        { ok: false, message: 'Valid email required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert (unique constraint on email handles duplicates)
    const { error } = await supabase
      .from('subscribers')
      .insert({ email });

    // If duplicate, return success anyway (idempotent UX)
    if (error && !/duplicate key/i.test(error.message)) {
      return NextResponse.json(
        { ok: false, message: 'Database error' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { ok: true, message: 'Thanks! You’re on the list.' },
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
