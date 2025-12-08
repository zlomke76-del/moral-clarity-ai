// lib/supabase/server.ts
// ----------------------------------------------
// Supabase client for SSR (Node runtime)
// Compatible with Next.js 16 cookie API
// ----------------------------------------------

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClientServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies();          // FIXED: cookies() is async
          return store.get(name)?.value;
        },
        async set(name, value, options) {
          const store = await cookies();          // FIXED
          try {
            store.set(name, value, options);
          } catch (_) {
            /* SSR cookie writes silently ignored */
          }
        },
        async remove(name: string, options) {
          const store = await cookies();          // FIXED
          try {
            store.delete(name);
          } catch (_) {
            /* ignore */
          }
        },
      },
    }
  );
}
