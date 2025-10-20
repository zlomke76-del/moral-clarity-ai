// app/auth/sign-out/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const runtime = "nodejs";

export async function POST() {
  const reqCookies = cookies();

  // Build a redirect response first so we can write cookie mutations onto it
  const redirectBase = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moralclarity.ai";
  const res = NextResponse.redirect(new URL("/", redirectBase));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Use a minimal adapter that works across @supabase/ssr versions.
      cookies: {
        get(name: string) {
          return reqCookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: "", ...options });
        },
      } as any, // ← tolerate CookieMethodsServer / Deprecated differences
    }
  );

  await supabase.auth.signOut();

  return res;
}
