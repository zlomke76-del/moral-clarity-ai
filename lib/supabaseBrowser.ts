// lib/supabaseBrowser.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

let _client: any = null;

/** Singleton browser client. No typing from @supabase/ssr to avoid TS export issues. */
export function createSupabaseBrowser() {
  if (_client) return _client;
  if (typeof window === 'undefined') return null; // safety: never create on server

  _client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return _client;
}

