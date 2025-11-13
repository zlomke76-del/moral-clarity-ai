// app/auth/sign-out/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const reqCookies = cookies();

  // Prefer explicit site URL, but fall back to request origin if needed
  const reqUrl = req.nextUrl;
  const fallbackOrigin = `${reqUrl.protocol}//${reqUrl.host}`;
  const redirectBase =
    process.env.NEXT_PUBLIC_SITE_URL ?? fallbackOrigin;

  // You can change "/" → "/auth/sign-in" if you want to always land on sign-in
  const res = NextResponse.redirect(new URL("/", redirectBase));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Minimal adapter that works across @supabase/ssr versions
      cookies: {
        get(name: string) {
          return reqCookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Write mutations onto the redirect response
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Supabase will pass the right options (e.g. path, domain, maxAge)
          res.cookies.set({ name, value: "", ...options });
        },
      } as any,
    }
  );

  await supabase.auth.signOut();

  return res;
}
