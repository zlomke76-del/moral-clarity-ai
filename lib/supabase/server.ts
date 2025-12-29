import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient(accessToken?: string) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : undefined,
      cookies: {
        get() {
          return undefined;
        },
        set() {},
        remove() {},
      },
    }
  );
}
