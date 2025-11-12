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
    // everything except api, _next assets, and files with extensions
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
  //    If a `?code=` is present, bounce to /auth/callback to exchange the session.
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const to = new URL("/auth/callback", req.url);
    to.searchParams.set("code", code);
    // honor provided next or default to /app
    to.searchParams.set("next", searchParams.get("next") || "/app");
    return NextResponse.redirect(to, 307);
  }

  // 2) Let public preview routes pass untouched
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // 3) Create a mutable response so Supabase can refresh cookies
  const res = NextResponse.next({ request: { headers: req.headers } });

  // 4) Supabase client (middleware-safe) using the cookies adapter
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options?: any) =>
          res.cookies.set({ name, value, ...(options ?? {}) }),
        remove: (name: string, options?: any) =>
          res.cookies.set({ name, value: "", ...(options ?? {}), maxAge: 0 }),
      } as any,
    }
  );

  // 5) Touch session so it auto-refreshes if needed (no-op if signed out)
  await supabase.auth.getSession();

  // 6) (Optional) Gate /app — keep commented if you want soft entry
  // if (pathname.startsWith("/app")) {
  //   const { data: { user } } = await supabase.auth.getUser();
  //   if (!user) return NextResponse.redirect(new URL("/login", req.url));
  // }

  return res;
}
