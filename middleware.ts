// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/app", "/studio"]; // adjust to your private areas

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n) => req.cookies.get(n)?.value,
        set: (n, v, o) => res.cookies.set({ name: n, value: v, ...o }),
        remove: (n, o) => res.cookies.set({ name: n, value: "", ...o }),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const login = new URL("/auth/sign-in", req.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  return res;
}

export const config = {
  matcher: ["/app/:path*", "/studio/:path*"], // keep in sync with PROTECTED_PREFIXES
};
