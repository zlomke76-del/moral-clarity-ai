/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") || "/app";

    if (!code) {
      // No code to exchange — bounce back to sign-in with a friendly error
      return NextResponse.redirect(
        new URL(`/auth/sign-in?err=missing_code`, url.origin),
        { status: 302 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?err=env_missing`, url.origin),
        { status: 302 }
      );
    }

    // Adapt Next.js cookies() to the shape expected by @supabase/ssr:
    // The current CookieMethodsServer type uses getAll/set/remove (no "get")
    const store = cookies();
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return store.getAll();
        },
        set(name: string, value: string, options: any) {
          store.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          // remove by setting empty value + maxAge 0
          store.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    });

    // Exchange the one-time code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?err=exchange_failed`, url.origin),
        { status: 302 }
      );
    }

    // Success → go to wherever we intended
    return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
  } catch (e: any) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?err=callback_exception`, new URL(request.url).origin),
      { status: 302 }
    );
  }
}
