// middleware.ts
// Auth/session boundary for Moral Clarity AI

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

function createMiddlewareResponse(req: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  applyCSP(response);
  return response;
}

function safeRedirectPath(pathname: string, search = "") {
  return `${pathname}${search}`;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  let response = createMiddlewareResponse(req);

  const isAuthRoute = pathname.startsWith("/auth");
  const isAuthEntryRoute =
    pathname === "/auth/sign-in" ||
    pathname === "/auth/callback" ||
    pathname === "/auth/error" ||
    pathname === "/auth/check-email" ||
    pathname === "/auth/exchange" ||
    pathname === "/auth/start";

  // The callback must remain completely unblocked so Supabase can exchange
  // the code/token and write the session cookies before protected routes run.
  if (isAuthEntryRoute) {
    return response;
  }

  // --------------------------------------------------
  // Supabase SSR client
  // --------------------------------------------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value);
          });

          response = createMiddlewareResponse(req);

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedAppRoute =
    pathname.startsWith("/app") ||
    pathname.startsWith("/w") ||
    pathname.startsWith("/admin");

  // --------------------------------------------------
  // Logged in users should not remain on non-entry auth routes
  // --------------------------------------------------
  if (user && isAuthRoute) {
    const redirect = NextResponse.redirect(new URL("/app", req.url));
    applyCSP(redirect);
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  }

  // --------------------------------------------------
  // Not logged in -> protect app, workspace, and admin
  // --------------------------------------------------
  if (!user && isProtectedAppRoute) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("redirectedFrom", safeRedirectPath(pathname, search));

    const redirect = NextResponse.redirect(signInUrl);
    applyCSP(redirect);
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/admin/:path*", "/auth/:path*"],
};
