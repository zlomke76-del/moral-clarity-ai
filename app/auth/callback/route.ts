import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(`${origin}/auth/sign-in`);
    }

    // ✅ Correct cookie adapter shape
    const supabase = createRouteHandlerClient({ cookies: () => cookies() });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchange failed", error);
      return NextResponse.redirect(`${origin}/auth/sign-in`);
    }

    return NextResponse.redirect(`${origin}/app`);
  } catch (err) {
    console.error("[auth/callback] unexpected error", err);
    return NextResponse.redirect(`${origin}/auth/sign-in`);
  }
}
