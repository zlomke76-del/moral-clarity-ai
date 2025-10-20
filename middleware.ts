// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/app", "/studio"];

// Paths we never want middleware logic to touch
const IGNORE_PREFIXES = [
  "/_next",        // next assets
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/api",          // if you protect APIs separately, leave this ignored
  "/auth",         // avoid loops on sign-in/out/callback
  "/dev",          // keep dev helpers snappy
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip entirely for static and explicitly ignored paths
  if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isHome = pathname === "/";
  const requiresAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // We’ll potentially set refreshed cookies, so start with a mutable response.
  const res = NextResponse.next();

  // Optional: allow a demo/impersonation cookie to bypass auth during testing
  const demoOn = req.cookies.get("mcai_demo")?.value === "1";
  if (requiresAuth && demoOn) {
    return res; // treat as authenticated
  }

  // Only read session for protected routes and "/" (home redirect)
  if (!(requiresAuth || isHome)) {
    return res;
  }

  // --- Supabase session check (defensive) ---
  let user = null as null | { id: string };

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            res.cookies.set({ name, value: "", ...options });
          },
        } as any,
      }
    );

    const result = await supabase.auth.getUser();
    user = result.data.user ? { id: result.data.user.id } : null;
  } catch {
    // If Supabase hiccups, fall through — we’ll treat as signed-out
  }

  // Gate product routes
  if (requiresAuth && !user) {
    const loginUrl = new URL("/auth/sign-in", req.url);
    // preserve intended destination (including any query)
    loginUrl.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  // Auto-redirect home → /app when signed in
  if (isHome && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  // include "/" so we can redirect signed-in users away from public surface
  matcher: ["/", "/app/:path*", "/studio/:path*"],
};
