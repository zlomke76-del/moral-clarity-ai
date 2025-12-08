// middleware.ts
import { createMiddlewareClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });

  // Try to load session
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Protect /app and /w/**
  if (!session && (pathname.startsWith("/app") || pathname.startsWith("/w"))) {
    const redirect = new URL(
      `/auth/sign-in?redirectedFrom=${encodeURIComponent(pathname)}`,
      req.url
    );
    return NextResponse.redirect(redirect);
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/auth/callback"],
};
