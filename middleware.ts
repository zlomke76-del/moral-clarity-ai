// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/api/:path*"], // expanded coverage if needed
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the unauthenticated preview route if you keep it under /app/preview
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // ✅ Create a mutable response (so we can refresh cookies)
  const res = NextResponse.next({ request: { headers: req.headers } });

  // ✅ Initialize Supabase SSR client (refreshes auth cookies transparently)
  const supa = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.set({ name, value: "", ...options, maxAge: 0 }),
      },
    }
  );

  // Touch the session so Supabase auto-refreshes if needed
  await supa.auth.getSession();

  // ✅ Optional: if you want to redirect unauthenticated users from /app/* later
  // const { data } = await supa.auth.getUser();
  // if (!data.user && pathname.startsWith("/app")) {
  //   const redirectUrl = new URL("/login", req.url);
  //   return NextResponse.redirect(redirectUrl);
  // }

  return res;
}
