// middleware.ts
// bump: v6  <-- forces Vercel edge rebuild

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/ssr";

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
  const res = NextResponse.next();
  applyCSP(res);

  const pathname = req.nextUrl.pathname;

  // --------------------------------------------------
  // 🔓 Allow auth entry + callback
  // --------------------------------------------------
  if (pathname === "/auth/sign-in" || pathname === "/auth/callback") {
    return res;
  }

  // --------------------------------------------------
  // ✅ Correct Edge Supabase client
  // --------------------------------------------------
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // --------------------------------------------------
  // 🟢 Logged in → block auth pages
  // --------------------------------------------------
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // --------------------------------------------------
  // 🔴 Not logged in → protect app routes
  // --------------------------------------------------
  if (
    !session &&
    (pathname.startsWith("/app") || pathname.startsWith("/w"))
  ) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/auth/:path*"],
};
