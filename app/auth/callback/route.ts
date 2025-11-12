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

    const store = cookies();

    // Supply BOTH method shapes; cast to any to satisfy union types across versions.
    const cookieAdapter = {
      // v0.x (deprecated) shape
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options?: any) {
        store.set({ name, value, ...(options || {}) });
      },
      remove(name: string, options?: any) {
        store.set({ name, value: "", ...(options || {}), maxAge: 0 });
      },
      // newer shape
      getAll() {
        return store.getAll();
      },
    } as any;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: cookieAdapter,
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?err=exchange_failed`, url.origin),
        { status: 302 }
      );
    }

    return NextResponse.redirect(new URL(next, url.origin), { status: 302 });
  } catch {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(
      new URL(`/auth/sign-in?err=callback_exception`, origin),
      { status: 302 }
    );
  }
}
