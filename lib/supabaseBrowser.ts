// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseClientType | null = null;

/**
 * Preferred helper: create (or reuse) a browser Supabase client
 * configured for PKCE auth flow.
 */
export function createSupabaseBrowser(): SupabaseClientType {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Important: PKCE so the magic-link + callback flow works
          flowType: 'pkce',
        },
      }
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
