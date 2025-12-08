// lib/supabase/server.ts
// ------------------------------------------------
// Supabase SSR factory — caller must pass cookie header
// This avoids all Next.js 16 typed cookie/header traps.
// ------------------------------------------------

import { createServerClient } from "@supabase/ssr";

export function createClientServer(cookieHeader: string = "") {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const match = cookieHeader
            .split(";")
            .map((v) => v.trim())
            .find((x) => x.startsWith(name + "="));

          return match ? match.split("=")[1] : undefined;
        },

        set() {
          // SSR cannot mutate cookies — no-op
        },

        remove() {
          // SSR cannot mutate cookies — no-op
        },
      },
    }
  );
}

