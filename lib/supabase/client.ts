// lib/supabase/client.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Canonical browser client.
 * Safe to import in client components. Assumes NEXT_PUBLIC_* vars exist.
 */
export function supabaseBrowser(): SupabaseClient {
  if (!URL || !ANON) {
    // Fail fast in dev to surface misconfig; keep a soft guard in prod.
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }
  return createClient(URL, ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Back-compat shim so existing imports keep working.
 * Usage: const supabase = createSupabaseBrowser()
 */
export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };
