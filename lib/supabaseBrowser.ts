// lib/supabaseBrowser.ts
import { createBrowserClient, type SupabaseClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

let _client: SupabaseClient<Database> | null = null;

export function createSupabaseBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('createSupabaseBrowser() must be called in the browser.');
  }
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  _client = createBrowserClient<Database>(url, key);
  return _client;
}
