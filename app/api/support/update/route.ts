// app/api/support/update/route.ts
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getServerSupabase() {
  // Accept either SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role on the server, fall back to anon if you truly want that
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  const supabase = getServerSupabase();
  if (!supabase) {
    // don’t throw at import time—return an error at runtime
    return new Response('Missing Supabase env', { status: 500 });
  }

  // ... your existing logic ...
  return new Response('ok', { status: 200 });
}
