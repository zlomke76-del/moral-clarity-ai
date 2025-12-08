// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  if (!code) {
    return NextResponse.redirect(
      `${url.origin}/auth/error?err=Missing%20code`
    );
  }

  // Outgoing response (required so Supabase can write cookies)
  const res = NextResponse.redirect(`${url.origin}${next}`);

  // Correct cookie domain for production
  const cookieDomain =
    url.hostname === "localhost" ? undefined : "studio.moralclarity.ai";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.headers
            .get("cookie")
            ?.split("; ")
            .find((c) => c.startsWith(`${name}=`))
            ?.split("=")[1];
        },

        set(name: string, value: string, options?: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
            domain: cookieDomain,
            secure: true,
            httpOnly: true,
            sameSite: "none",
            path: "/",
          });
        },

        remove(name: string, options?: CookieOptions) {
          res.cookies.set({
            name,
            value: "",
            maxAge: 0,
            ...options,
            domain: cookieDomain,
            secure: true,
            httpOnly: true,
            sameSite: "none",
            path: "/",
          });
        },
      },
    }
  );

  // Exchange magic link code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    return NextResponse.redirect(
      `${url.origin}/auth/error?err=Auth%20session%20failed`
    );
  }

  return res;
}
