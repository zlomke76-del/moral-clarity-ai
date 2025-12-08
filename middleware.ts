// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// ---------------------------------------------
// Compatible with your installed Supabase version
// ---------------------------------------------
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Build supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          try {
            res.cookies.set(name, value, options);
          } catch {
            /* ignore write failures in middleware */
          }
        },
        remove(name: string, options) {
          try {
            res.cookies.delete(name);
          } catch {
            /* ignore */
          }
        },
      },
    }
  );

  // Load current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Protect app routes
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
