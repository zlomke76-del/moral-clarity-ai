// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ DO NOT PROTECT CALLBACK ROUTE
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

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
          } catch {}
        },
        remove(name, options) {
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

  // Protect app + workspace routes
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
  // ❌ Removed "/auth/callback"
  matcher: ["/app/:path*", "/w/:path*"],
};

