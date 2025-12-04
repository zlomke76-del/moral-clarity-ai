// lib/supabase/server.ts
"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client
 * Works correctly with Next.js 16 (cookies() is now async)
 */
export async function supabaseServer() {
  const cookieStore = await cookies(); // ✅ FIXED — cookies() is async now

  return createClient(URL, KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: (...args) => fetch(...args),
      headers: {
        // Pass through cookies for RLS policies
        Authorization: cookieStore.get("sb-access-token")?.value
          ? `Bearer ${cookieStore.get("sb-access-token")!.value}`
          : "",
      },
    },
    cookies: {
      /**
       * Next 16's cookieStore returns ReadonlyRequestCookies
       */
      get(name: string) {
        const v = cookieStore.get(name);
        return v?.value;
      },

      /**
       * Server routes writing cookies must patch the response —
       * this no-op is fine here because server code never mutates cookies
       */
      set() {},
      remove() {},
    },
  });
}

