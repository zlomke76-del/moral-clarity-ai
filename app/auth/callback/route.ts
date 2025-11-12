/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

function redirectToSignIn(err: string) {
  return NextResponse.redirect(
    new URL(`/auth/sign-in?err=${encodeURIComponent(err)}`, process.env.NEXT_PUBLIC_BASE_URL || "https://studio.moralclarity.ai")
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/app";

    if (!code) return redirectToSignIn("missing_code");

    const cookieStore = cookies();

    // Build a Supabase *server* client that can SET auth cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: any) =>
            cookieStore.set({ name, value, ...options }),
          remove: (name: string, options: any) =>
            cookieStore.set({ name, value: "", ...options, expires: new Date(0) }),
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.warn("exchangeCodeForSession error:", error.message);
      return redirectToSignIn("exchange_failed");
    }

    // Success → send them to the intended page; auth cookies are now set
    return NextResponse.redirect(new URL(next, process.env.NEXT_PUBLIC_BASE_URL || "https://studio.moralclarity.ai"));
  } catch (e: any) {
    console.error("auth/callback fatal:", e?.message || e);
    return redirectToSignIn("callback_exception");
  }
}
