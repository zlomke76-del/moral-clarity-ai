// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

// Protect these URL prefixes (adjust as needed)
const PROTECTED_PREFIXES = ["/app", "/studio"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip protection for public routes
  const requiresAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!requiresAuth) return NextResponse.next();

  // Prepare a mutable response so we can set cookies during refresh/sign-out, etc.
  const res = NextResponse.next();

  // Create Supabase client for middleware, adapting cookies onto the response.
  // We cast to `any` to tolerate CookieMethodsServer{,Deprecated} type drift between versions.
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/auth/sign-in", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/studio/:path*"], // keep in sync with PROTECTED_PREFIXES
};
