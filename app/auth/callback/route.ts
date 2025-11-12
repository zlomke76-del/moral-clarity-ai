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

  // If Supabase didn't send us a code, bounce back with a clear error
  if (!code) {
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set("err", "Missing auth code from Supabase.");
    return NextResponse.redirect(errUrl.toString(), 302);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    console.error("[auth/callback] Missing Supabase env vars", {
      hasUrl: !!supabaseUrl,
      hasAnon: !!supabaseAnon,
    });
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set(
      "err",
      "Server misconfigured: missing Supabase URL or anon key."
    );
    return NextResponse.redirect(errUrl.toString(), 302);
  }

  const cookieStore = cookies();

  // Bridge Next.js cookies ↔ Supabase cookies.
  // Cast to `any` so TS stops arguing about CookieMethodsServer vs deprecated types.
  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options });
      },
    } as any,
  });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error);
      const errUrl = new URL("/auth/sign-in", origin);
      errUrl.searchParams.set(
        "err",
        `Auth exchange failed: ${error.message ?? "Unknown error"}`
      );
      return NextResponse.redirect(errUrl.toString(), 302);
    }

    // Success – user is now signed in via Supabase session cookie.
    const redirectUrl = new URL(next, origin);
    return NextResponse.redirect(redirectUrl.toString(), 302);
  } catch (e: any) {
    console.error("[auth/callback] unexpected error:", e);
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set(
      "err",
      `Unexpected auth error: ${e?.message ?? String(e)}`
    );
    return NextResponse.redirect(errUrl.toString(), 302);
  }
}
