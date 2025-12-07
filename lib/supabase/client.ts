// lib/supabase/client.ts
// Canonical browser-side Supabase client (Next.js 16+)

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser Supabase client.
 * Safe in client components and hooks.
 */
export function supabaseBrowser(): SupabaseClient {
  if (!URL || !ANON) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  }

  return createClient(URL, ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,

      /** 🔥 REQUIRED FOR COOKIES TO WORK ON studio.moralclarity.ai */
      storage: "cookie",
      cookieOptions: {
        domain: "studio.moralclarity.ai",  // MUST match your subdomain exactly
        path: "/",
        sameSite: "lax",                    // Chrome will block "none" here
        secure: true,
      },
    },
  });
}

/** Backwards compatibility */
export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };
