// middleware.ts
// bump: v3  <-- 🔥 Forces Vercel to rebuild the Edge Function bundle

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          try { res.cookies.set(name, value, options); } catch {}
        },
        remove: (name, options) => {
          try { res.cookies.delete(name); } catch {}
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 🟢 LOGGED IN → block access to auth pages
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // 🔴 NOT LOGGED IN → protect /app and /w
  if (!session && (pathname.startsWith("/app") || pathname.startsWith("/w"))) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?redirectedFrom=${pathname}`, req.url)
    );
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/auth/:path*"], // unchanged
};
