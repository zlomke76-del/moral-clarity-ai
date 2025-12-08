// lib/supabase/server.ts
// ----------------------------------------------
// Supabase client for SSR (Node runtime)
// Compatible with Next.js 16 cookie API
// ----------------------------------------------

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClientServer() {
  const cookieStore = cookies(); // ✅ synchronous

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value; // ⬅️ No await
        },

        set(name, value, options) {
          try {
            cookieStore.set(name, value, options);
          } catch (_) {
            // SSR cannot always set cookies — safe to ignore
          }
        },

        remove(name: string, options) {
          try {
            cookieStore.delete(name, options);
          } catch (_) {
            // Silent ignore
          }
        },
      },
    }
  );
}

