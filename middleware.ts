// middleware.ts
// bump: v8

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// --------------------------------------------------
// Content Security Policy
// --------------------------------------------------
function applyCSP(res: NextResponse) {
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https: data:",
      "font-src 'self' https:",
      "connect-src 'self' https:",
      "media-src 'self' https:",
      "frame-src 'self'",
    ].join("; ")
  );
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next();
  applyCSP(res);

  // --------------------------------------------------
  // Allow auth entry + callback
  // --------------------------------------------------
  if (pathname === "/auth/sign-in" || pathname === "/auth/callback") {
    return res;
  }

  // --------------------------------------------------
  // Supabase SSR client (read-only in middleware)
  // --------------------------------------------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedAppRoute =
    pathname.startsWith("/app") ||
    pathname.startsWith("/w") ||
    pathname.startsWith("/admin");

  // --------------------------------------------------
  // Logged in users should not see auth pages
  // --------------------------------------------------
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // --------------------------------------------------
  // Not logged in -> protect app, workspace, and admin
  // --------------------------------------------------
  if (!session && isProtectedAppRoute) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/admin/:path*", "/auth/:path*"],
};
