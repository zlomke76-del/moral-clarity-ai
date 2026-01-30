// middleware.ts
// v8 — Edge-safe, env-free, zero external authority calls

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

// --------------------------------------------------
// Edge-safe session presence check
// --------------------------------------------------
// NOTE:
// Middleware does NOT validate sessions.
// It only checks for presence of auth cookies.
// True authorization occurs server-side + via RLS.
function hasSupabaseSession(req: NextRequest): boolean {
  return Boolean(
    req.cookies.get("sb-access-token") ||
      req.cookies.get("sb:token") ||
      req.cookies.get("supabase-auth-token")
  );
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  applyCSP(res);

  const pathname = req.nextUrl.pathname;
  const isAuthenticated = hasSupabaseSession(req);

  // --------------------------------------------------
  // 🔓 Allow auth entry + callback unconditionally
  // --------------------------------------------------
  if (pathname === "/auth/sign-in" || pathname === "/auth/callback") {
    return res;
  }

  // --------------------------------------------------
  // 🟢 Logged in → block auth pages
  // --------------------------------------------------
  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // --------------------------------------------------
  // 🔴 Not logged in → protect gated routes
  // --------------------------------------------------
  if (
    !isAuthenticated &&
    (pathname.startsWith("/app") || pathname.startsWith("/w"))
  ) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return res;
}

// --------------------------------------------------
// Middleware scope
// --------------------------------------------------
export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/auth/:path*"],
};
