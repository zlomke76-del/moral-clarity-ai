import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  if (!code) {
    return NextResponse.redirect(`${url.origin}/auth/error?err=Missing%20code`);
  }

  // Create a response so Supabase can write cookies
  const res = NextResponse.redirect(`${url.origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.headers.get("cookie") ?? null;
        },
        set(name: string, value: string, options?: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
            domain: ".moralclarity.ai",
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
            domain: ".moralclarity.ai",
            path: "/",
            secure: true,
            sameSite: "none",
          });
        },
      },
    }
  );

  // Exchange code for session AND write cookies
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${url.origin}/auth/error?err=Auth%20session%20failed`
    );
  }

  return res;
}
