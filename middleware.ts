// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Opt-in to the edge runtime (required for middleware)
export const config = {
  matcher: [
    "/app/:path*",
    "/w/:path*",
    "/memories/:path*",
    "/newsroom/:path*",
  ],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Allow the magic link callback to pass through unmodified
  if (url.pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // 2. Allow public routes
  if (
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  // 3. Create Supabase client (Next.js 16 requires async cookie getter)
  const supabase = createRouteHandlerClient({
    cookies: async () => req.cookies,  // FIXED: must return Promise<ReadonlyRequestCookies>
  });

  // 4. Safely get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 5. If no session → redirect to sign-in
  if (!session) {
    const redirectUrl = new URL("/auth/sign-in", req.url);
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 6. Otherwise continue
  return NextResponse.next();
}

