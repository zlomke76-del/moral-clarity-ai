// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const config = {
  // Do NOT run on /auth/callback — this is critical
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|auth/callback|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt)).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const { pathname, searchParams } = url;

  // Legacy redirect
  if (pathname === "/workspace2" || pathname.startsWith("/workspace2/")) {
    return NextResponse.redirect(new URL("/app", req.url), 308);
  }

  // Magic-link: forward ?code=XYZ to /auth/callback
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const redirect = new URL("/auth/callback", req.url);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("next", searchParams.get("next") || "/app");
    return NextResponse.redirect(redirect, 307);
  }

  // Normal pass-through
  const res = NextResponse.next({
    request: { headers: req.headers }
  });

  // NEVER GUESS DOMAIN AGAIN — Chrome requires exact match
  const cookieDomain = "studio.moralclarity.ai";

  // Supabase SSR client for token refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
            domain: cookieDomain,
            path: "/",
            secure: true,
            sameSite: "none",
          });
        },
        remove(name: string, options?: CookieOptions) {
          res.cookies.set({
            name,
            value: "",
            maxAge: 0,
            ...options,
            domain: cookieDomain,
            path: "/",
            secure: true,
            sameSite: "none",
          });
        },
      },
    }
  );

  await supabase.auth.getSession(); // refresh tokens if needed

  return res;
}
