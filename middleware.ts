// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt)).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // legacy redirect
  if (pathname === "/workspace2" || pathname.startsWith("/workspace2/")) {
    return NextResponse.redirect(new URL("/app", req.url), 308);
  }

  // magic-link reroute
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const to = new URL("/auth/callback", req.url);
    to.searchParams.set("code", code);
    to.searchParams.set("next", searchParams.get("next") || "/app");
    return NextResponse.redirect(to, 307);
  }

  // preview mode can pass
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // MUST create a mutable response for Supabase to write cookies
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  // ✔ Supabase-approved cookie adapter for SSR
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
            domain: ".moralclarity.ai",
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
            domain: ".moralclarity.ai",
            path: "/",
            secure: true,
            sameSite: "none",
          });
        },
      },
    }
  );

  // touch the session so Supabase refreshes cookies when needed
  await supabase.auth.getSession();

  return res;
}
