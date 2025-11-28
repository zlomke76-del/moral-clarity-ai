// lib/supabaseBrowser.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

type SupabaseClientType = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseClientType | null = null;

/**
 * Browser Supabase client using implicit auth flow.
 * - Magic links use implicit flow (no PKCE verifier cookie).
 * - detectSessionInUrl reads tokens from the redirect URL.
 */
export function createSupabaseBrowser(): SupabaseClientType {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: "implicit",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }

  return browserClient;
}

/**
 * Backwards compatibility alias.
 * Other modules still import getSupabaseBrowser, so we export it.
 */
export function getSupabaseBrowser(): SupabaseClientType {
  return createSupabaseBrowser();
}
