// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseClientType | null = null;

/**
 * Browser Supabase client using implicit auth flow.
 * - No PKCE exchangeCodeForSession calls.
 * - Supabase auto-detects the session from the magic link URL.
 */
export function createSupabaseBrowser(): SupabaseClientType {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'implicit',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }

  return browserClient;
}

// Back-compat alias (some files still import this)
export function getSupabaseBrowser(): SupabaseClientType {
  return createSupabaseBrowser();
}

