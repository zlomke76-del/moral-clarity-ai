// /lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClientBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,       // You selected persistent sessions
        autoRefreshToken: true,
        detectSessionInUrl: true,   // Required for magic link in browser
      },
    }
  );
}
