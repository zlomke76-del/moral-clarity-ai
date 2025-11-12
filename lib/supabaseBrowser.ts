// lib/supabaseBrowser.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabaseBrowser() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const storageKey =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || 'mc-auth';

  client = createClient(url, anon, {
    auth: {
      // valid v2 options
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storageKey,
      // ❌ no "multiTab" option in v2
    },
    global: { headers: { 'x-app': 'moralclarity-studio' } },
  });

  return client;
}

// keep backward compatibility for files importing createSupabaseBrowser
export const createSupabaseBrowser = getSupabaseBrowser;
