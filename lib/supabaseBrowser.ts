// lib/supabaseBrowser.ts
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let browserClient: SupabaseClient | null = null;

/**
 * Canonical browser Supabase client.
 * Singleton: only one GoTrueClient per browser context.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (!browserClient) {
    if ((!URL || !ANON) && process.env.NODE_ENV !== "production") {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }

    browserClient = createClient(URL, ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}

/**
 * Back-compat name for existing imports.
 * (mca-memory-client and any older code can keep using this.)
 */
export function createSupabaseBrowser(): SupabaseClient {
  return getSupabaseBrowser();
}

// Default export if anyone does `import supabaseBrowser from "@/lib/supabaseBrowser"`
export default getSupabaseBrowser;

