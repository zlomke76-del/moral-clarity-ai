// /lib/supabase.ts
import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, createBrowserClient } from '@supabase/ssr';

export function supabaseServer() {
  const c = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => c.get(n)?.value } }
  );
}

export function supabaseService() {
  // Accept either SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('supabaseUrl is required.');
  if (!key) throw new Error('service-role key missing (SUPABASE_SERVICE_ROLE_KEY).');
  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, key, { auth: { persistSession: false } });
}

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
