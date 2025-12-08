// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

// Required for middleware execution
export const config = {
  matcher: ["/app/:path*", "/w/:path*", "/memories/:path*", "/newsroom/:path*"],
};

// ⬇️ Adapter: converts RequestCookies → ReadonlyRequestCookies shape
function toReadonlyCookieStore(req: NextRequest) {
  return {
    get: (name: string) => req.cookies.get(name),
    getAll: () => req.cookies.getAll(),
  } as unknown as ReturnType<typeof import("next/headers").cookies>;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // 1. Allow magic-link callback
  if (url.pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  // 2. Allow public auth routes
  if (
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  // 3. Create Supabase client with cookie adapter
  const supabase = createRouteHandlerClient({
    cookies: () => toReadonlyCookieStore(req), // <-- FIXED
  });

  // 4. Fetch session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 5. Redirect to login if no session
  if (!session) {
    const redirectUrl = new URL("/auth/sign-in", req.url);
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 6. Continue
  return NextResponse.next();
}
