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
          // implicit flow so magic links go straight to /app
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
