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
  const { pathname, searchParams } = url;

  // Legacy redirect
  if (pathname === "/workspace2" || pathname.startsWith("/workspace2/")) {
    return NextResponse.redirect(new URL("/app", req.url), 308);
  }

  // Magic-link reroute
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const to = new URL("/auth/callback", req.url);
    to.searchParams.set("code", code);
    to.searchParams.set("next", searchParams.get("next") || "/app");
    return NextResponse.redirect(to, 307);
  }

  // /app/preview always passes
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // Required for Supabase to refresh cookies
  const res = NextResponse.next({ request: { headers: req.headers } });

  // Dynamically set correct cookie domain
  const hostname = url.hostname;
  const cookieDomain =
    hostname === "localhost" ? undefined : hostname; // do NOT use parent domain

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

  await supabase.auth.getSession();

  return res;
}
