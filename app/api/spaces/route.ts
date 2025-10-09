import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options?: CookieOptions) {
          // Next's cookies().set accepts an options object
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options?: CookieOptions) {
          // Remove = set with maxAge 0
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  const body = await req.json();

  // …use `supabase` with RLS, e.g. supabase.from('spaces').insert(...)
  // return NextResponse.json(...)
  return NextResponse.json({ ok: true });
}
