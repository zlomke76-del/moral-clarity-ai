// lib/supabaseBrowser.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseClientType | null = null;

export function createSupabaseBrowser(): SupabaseClientType {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // Back to implicit flow – Supabase will parse tokens from the URL fragment
          flowType: 'implicit',
        },
      }
    );
  }

  return browserClient;
}

export function getSupabaseBrowser(): SupabaseClientType {
  return createSupabaseBrowser();
}
