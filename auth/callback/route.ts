// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/app";

  if (!code) {
    return NextResponse.redirect(`${url.origin}/auth/error?err=Missing%20code`);
  }

  // Supabase SSR client with cookie adapter
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: () => undefined, // no cookies available on initial callback
        set: () => {},
        remove: () => {},
      } as any,
    }
  );

  // exchange the code for a session
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.session) {
    return NextResponse.redirect(
      `${url.origin}/auth/error?err=Auth%20session%20failed`
    );
  }

  // success → user authenticated → redirect to Studio
  return NextResponse.redirect(`${url.origin}${next}`);
}

