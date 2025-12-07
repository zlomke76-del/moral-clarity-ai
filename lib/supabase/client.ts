// lib/supabase/client.ts
// Canonical browser-side Supabase client for Next.js 16 (Edge-safe)
// Ensures authentication cookies are correctly scoped to the domain
// and forwarded to Edge Routes, enabling canonical identity + memory.

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser client used by UI components.
 * Critical: cookie domain must allow sending sb-access-token
 * to /api/chat and all Edge routes.
 */
export function supabaseBrowser(): SupabaseClient {
  if (!URL || !ANON) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }
  }

  return createBrowserClient(URL, ANON, {
    cookies: {
      // Name is managed internally by Supabase (sb-access-token, sb-refresh-token)
      lifetime: 60 * 60 * 24 * 7, // 7 days
      domain: ".moralclarity.ai", // *** REQUIRED FOR AUTH TO REACH EDGE ROUTES ***
      path: "/",
      sameSite: "none",
      secure: true,
    },
  });
}

/**
 * Backwards compatibility alias.
 */
export function createSupabaseBrowser(): SupabaseClient {
  return supabaseBrowser();
}

export type { SupabaseClient };
