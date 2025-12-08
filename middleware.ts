// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ⭐ 1. Allow Supabase magic link callback to bypass middleware
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  // 2. Normal middleware logic for protected routes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set(name, value, options) {
          try { res.cookies.set(name, value, options); } catch {}
        },
        remove(name) {
          try { res.cookies.delete(name); } catch {}
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 3. Protect signed-in areas
  if (!session && (pathname.startsWith("/app") || pathname.startsWith("/w"))) {
    const redirect = new URL(
      `/auth/sign-in?redirectedFrom=${encodeURIComponent(pathname)}`,
      req.url
    );
    return NextResponse.redirect(redirect);
  }

  return res;
}

// 4. Matcher — only protect app & workspace routes
export const config = {
  matcher: ["/app/:path*", "/w/:path*"],
};

