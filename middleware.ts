// middleware.ts
// bump: v4  <-- forces Vercel edge rebuild

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // --------------------------------------------------
  // 🔓 ALWAYS allow auth entry + callback routes
  // --------------------------------------------------
  if (
    pathname === "/auth/sign-in" ||
    pathname === "/auth/callback"
  ) {
    return res;
  }

  // --------------------------------------------------
  // Supabase SSR client
  // --------------------------------------------------
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          try {
            res.cookies.set(name, value, options);
          } catch {}
        },
        remove: (name, options) => {
          try {
            res.cookies.delete(name);
          } catch {}
        },
      },
    }
  );

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
