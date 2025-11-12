/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = cookies();

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // where to land after auth; honor ?next=/path if present, fallback to /app
  const next = url.searchParams.get('next') || '/app';

  const supabase = getSupabaseServer();

  if (code) {
    // Exchange the OTP/magic-link code for a first-party session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // If exchange fails, bounce to sign-in with a simple error hint
      return NextResponse.redirect(new URL(`/auth/sign-in?err=exchange_failed`, url.origin));
    }
  }

  // Important: do not point to /workspace2 (legacy). We ship the user into /app.
  return NextResponse.redirect(new URL(next, url.origin));
}
