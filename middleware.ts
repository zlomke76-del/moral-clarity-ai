// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// ⚠️ Middleware runs at the edge by default.
// We MUST NOT interfere with the Supabase callback flow.

// Paths that never require auth.
const PUBLIC_PATHS = [
  "/",
  "/auth",
  "/auth/callback",
  "/auth/error",
  "/newsroom",
  "/newsroom/cabinet",
  "/favicon.ico",
  "/logo.png",
];

// Prefixes that are always public.
const PUBLIC_PREFIXES = [
  "/_next",      // Next.js internals
  "/api/auth",   // Supabase needs these
  "/images",
  "/assets",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip ALL public routes
  if (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // 2. SPECIAL: Never block the callback — MUST pass through untouched.
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // 3. Protect only /app/*
  const isProtected = pathname.startsWith("/app");
  if (!isProtected) return NextResponse.next();

  // 4. Check Supabase session safely
  const supabase = createRouteHandlerClient({ cookies: () => req.cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session → redirect to sign-in
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/sign-in";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Middleware applies to ALL routes unless excluded above.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

