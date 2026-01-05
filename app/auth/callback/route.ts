// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${url.origin}/auth/sign-in`);
  }

  // Create a mutable response BEFORE calling Supabase
  const response = NextResponse.redirect(`${url.origin}/app`);

  // Create Supabase server client using the new SSR cookie adapter
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookieHeader = req.headers.get("cookie") ?? "";
          const match = cookieHeader.match(new RegExp(`${name}=([^;]+)`));
          return match?.[1];
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange failed", error);
    return NextResponse.redirect(`${url.origin}/auth/sign-in`);
  }

  return response;
}
