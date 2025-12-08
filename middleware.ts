// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|txt)).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const { pathname, searchParams } = url;

  // reroute PKCE callback
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const redirect = new URL("/auth/callback", req.url);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("next", searchParams.get("next") || "/app");
    return NextResponse.redirect(redirect, 307);
  }

  // workspace2 legacy
  if (pathname === "/workspace2" || pathname.startsWith("/workspace2/")) {
    return NextResponse.redirect(new URL("/app", req.url), 308);
  }

  // ALWAYS allow /app/preview to pass
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // Prepare response (Supabase needs modifiable response)
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  // Correct cookie domain handling
  const cookieDomain =
    url.hostname === "localhost" ? undefined : "studio.moralclarity.ai";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },

        set(name: string, value: string, options?: CookieOptions) {
          // IMPORTANT:
          // middleware must NOT overwrite freshly set cookies during login
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

  // This causes Supabase to refresh session if needed WITHOUT overwriting during login
  await supabase.auth.getSession();

  return res;
}
