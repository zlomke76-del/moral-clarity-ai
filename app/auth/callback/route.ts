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

  // No code → bounce back with clear error
  if (!code) {
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set("err", "Missing auth code from Supabase");
    return NextResponse.redirect(errUrl.toString(), 302);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnon) {
    console.error("Missing Supabase env vars");
    const errUrl = new URL("/auth/sign-in", origin);
    errUrl.searchParams.set(
      "err",
      "Server is missing Supabase configuration (URL or anon key)."
    );
    return NextResponse.redirect(errUrl.toString(), 302);
  }

  const cookieStore = cookies();

  // Bridge Next cookies ↔ Supabase, and cast as any so TS stops complaining
  const supabase = createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options
