// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ⚠️ NEVER interfere with magic-link auth endpoints
  const AUTH_SAFE = [
    "/auth/callback",
    "/auth/exchange",
  ];

  if (AUTH_SAFE.some((p) => pathname.startsWith(p))) {
    // Pass through untouched — magic link must run without redirects
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // Build Supabase client using incoming cookies
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

  // ------------------------------------------------------------
  // AUTH LOGIC (applies ONLY to protected pages, never auth routes)
  // ------------------------------------------------------------

  // 1. If user is NOT logged in and accessing protected areas
  if (!session && (pathname.startsWith("/app") || pathname.startsWith("/w"))) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?redirectedFrom=${pathname}`, req.url)
    );
  }

  // 2. If user IS logged in and visits sign-in page → redirect to /app
  if (session && pathname === "/auth/sign-in") {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/app/:path*",
    "/w/:path*",
    "/auth/:path*",  // safe routes filtered above
  ],
};
