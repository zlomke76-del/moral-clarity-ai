// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/app", "/studio"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isHome = pathname === "/";
  const requiresAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // We'll potentially set refreshed cookies, so start with a mutable response.
  const res = NextResponse.next();

  // We need to read session for both protected routes and "/" (home-redirect).
  if (requiresAuth || isHome) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({ name, value: "", ...options });
          },
        } as any,
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Gate product routes
    if (requiresAuth && !user) {
      const loginUrl = new URL("/auth/sign-in", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Auto-redirect home → /app when signed in
    if (isHome && user) {
      const url = req.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  // include "/" so we can redirect signed-in users away from public surface
  matcher: ["/", "/app/:path*", "/studio/:path*"],
};
