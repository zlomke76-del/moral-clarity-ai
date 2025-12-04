import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Next 16 requires `cookies()` to be awaited.
 * This wrapper returns a fully typed Supabase client
 * with correct cookie adapter semantics.
 */
export async function supabaseServer() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const c = cookieStore.get(name);
          return c?.value ?? null;
        },

        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },

        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", maxAge: 0, ...options });
        },
      },
    }
  );

  return supabase;
}
