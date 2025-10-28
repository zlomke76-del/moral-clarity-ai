// /lib/supabase.ts
import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, createBrowserClient } from '@supabase/ssr';

export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export function supabaseService() {
  // Service-role server client (no cookies, server only)
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export function supabaseBrowser() {
  // For client components that need RLS-protected reads (optional)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
