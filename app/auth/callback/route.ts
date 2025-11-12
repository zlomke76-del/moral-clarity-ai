// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/app';

  if (!code) {
    const redirectUrl = new URL(
      '/auth/sign-in?err=Auth+exchange+failed%3A+invalid+request%3A+missing+code',
      req.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
      auth: {
        // Must match the browser client
        flowType: 'pkce',
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const redirectUrl = new URL(
      `/auth/sign-in?err=${encodeURIComponent(
        `Auth exchange failed: ${error.message}`,
      )}`,
      req.url,
    );
    return NextResponse.redirect(redirectUrl);
  }

  const redirectUrl = new URL(next, req.url);
  return NextResponse.redirect(redirectUrl);
}
