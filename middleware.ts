// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Match all app-facing routes but exclude API, Next assets, and common static files.
 * This ensures magic-link callbacks like `/?code=...` are caught by middleware.
 */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt)).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const { pathname, searchParams } = url;

  // 0) Legacy studio path → /app
  if (pathname === "/workspace2" || pathname.startsWith("/workspace2/")) {
    const to = new URL("/app", req.url);
    return NextResponse.redirect(to, 308);
  }

  // 1) Handle Supabase magic-link redirects anywhere in the site.
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const to = new URL("/auth/callback", req.url);
    to.searchParams.set("code", code);
    to.searchParams.set("next", searchParams.get("next") || "/app");
    return NextResponse.redirect(to, 307);
  }

  // 2) Let public preview routes pass untouched
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // 3) Create response so Supabase can refresh cookies
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  // 4) Supabase client with proper cross-domain cookie persistence
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,

        set: (name: string, value: string, options?: any) =>
          res.cookies.set({
            name,
            value,
            domain: ".moralclarity.ai",
            path: "/",
            secure: true,
            sameSite: "none",
            ...(options ?? {}),
          }),

        remove: (name: string, options?: any) =>
          res.cookies.set({
            name,
            value: "",
            domain: ".moralclarity.ai",
            path: "/",
            secure: true,
            sameSite: "none",
            maxAge: 0,
            ...(options ?? {}),
          }),
      },
    }
  );

  // 5) Touch the session (refresh or noop)
  await supabase.auth.getSession();

  return res;
}
