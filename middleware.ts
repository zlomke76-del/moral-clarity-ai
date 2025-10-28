// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/ssr";

export const config = {
  // You can include /api if you want auth refreshes there too, but it adds overhead.
  matcher: ["/app/:path*", "/w/:path*"], 
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow unauthenticated preview routes
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // Create a mutable response so cookies can be updated
  const res = NextResponse.next({ request: { headers: req.headers } });

  // Supabase client for middleware (handles cookie refresh internally)
  const supabase = createMiddlewareClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    }
  );

  // Touch the session to auto-refresh if needed
  await supabase.auth.getSession();

  // Optional: gate /app behind auth later
  // const { data } = await supabase.auth.getUser();
  // if (!data.user && pathname.startsWith("/app")) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return res;
}
