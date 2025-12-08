// /lib/supabase/edge.ts
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export function createClientEdge(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set() {
          // Edge/middleware cannot mutate cookies directly here
        },
        remove() {},
      },
    }
  );
}
