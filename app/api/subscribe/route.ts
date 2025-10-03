// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // Server-side only — safe to use Service Role here
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN ?? '*', // you already set this in Vercel
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400, headers: corsHeaders });
    }

    // Insert into "subscribers" table
    const { error } = await supabase.from('subscribers').insert([{ email }]);
    if (error) {
      // If duplicate email, treat as success (idempotent UX)
      const isDup = /duplicate key value|unique/i.test(error.message || '');
      if (!isDup) {
        return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
      }
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Server error' }, { status: 500, headers: corsHeaders });
  }
}
