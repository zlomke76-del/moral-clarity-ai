// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const config = {
  matcher: ["/app/:path*", "/w/:path*"], // keep API out unless you need refreshes there
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let public preview routes pass
  if (pathname.startsWith("/app/preview")) {
    return NextResponse.next();
  }

  // Mutable response so Supabase can refresh cookies
  const res = NextResponse.next({ request: { headers: req.headers } });

  // Supabase client (middleware-safe) using cookies adapter
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Cast keeps TS happy across ssr package versions
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options?: any) =>
          res.cookies.set({ name, value, ...(options ?? {}) }),
        remove: (name: string, options?: any) =>
          res.cookies.set({ name, value: "", ...(options ?? {}), maxAge: 0 }),
      } as any,
    }
  );

  // Touch session so it auto-refreshes if needed
  await supabase.auth.getSession();

  // Optional gate for /app:
  // const { data } = await supabase.auth.getUser();
  // if (!data.user && pathname.startsWith("/app")) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return res;
}
