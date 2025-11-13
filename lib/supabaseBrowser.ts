// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseClientType | null = null;

/**
 * Preferred helper: create (or reuse) a browser Supabase client.
 * Using implicit flow so magic links can be opened from any browser/tab.
 */
export function createSupabaseBrowser(): SupabaseClientType {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // implicit is the default, but we’re explicit for clarity
          flowType: 'implicit',
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
