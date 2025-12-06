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
          // Use implicit flow for magic links so we don't depend on PKCE verifier cookies
          flowType: 'implicit',
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    );
  }

  return browserClient;
}

/**
 * Backwards-compat alias so older code that imports getSupabaseBrowser
 * continues to work without changes.
 */
export function getSupabaseBrowser(): SupabaseClientType {
  return createSupabaseBrowser();
}
