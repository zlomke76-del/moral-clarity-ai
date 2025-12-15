// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // If Supabase didn't send a code, bounce cleanly
  if (!code) {
    return NextResponse.redirect(new URL("/auth/sign-in", url.origin));
  }

  const supabase = createRouteHandlerClient({ cookies });

  // 🔑 THIS IS THE ENTIRE POINT OF THE FILE
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange failed", error);
    return NextResponse.redirect(new URL("/auth/sign-in", url.origin));
  }

  // ✅ Cookies are now written server-side
  return NextResponse.redirect(new URL("/app", url.origin));
}
