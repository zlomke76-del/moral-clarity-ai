/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/app";

  const origin = url.origin;

  // If there's no code, send back to sign-in with an error
  if (!code) {
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set("err", "exchange_failed");
    return NextResponse.redirect(errUrl.toString(), 302);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    console.error("Missing Supabase env vars");
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set("err", "exchange_failed");
    return NextResponse.redirect(errUrl.toString(), 302);
  }

  const cookieStore = cookies();

  // NOTE: cast cookies object as any so we don't fight TS over the shape.
  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    } as any,
  });

  try {
    // Ask Supabase to turn the code into a session + set the auth cookie
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error("exchangeCodeForSession error:", error?.message);
      const errUrl = new URL("/auth/sign-in", origin);
      errUrl.searchParams.set("err", "exchange_failed");
      return NextResponse.redirect(errUrl.toString(), 302);
    }

    // Success → send them to the requested next page (default /app)
    const redirectUrl = new URL(next, origin);
    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (err: any) {
    console.error("Callback route exception:", err);
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set("err", "exchange_failed");
    return NextResponse.redirect(errUrl.toString(), 302);
  }
}
