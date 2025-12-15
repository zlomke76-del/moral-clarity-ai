import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/sign-in`);
  }

  // 🔑 Next.js 16: cookies() IS ASYNC
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  // If exchange fails or cookies aren’t set correctly
  if (error || !cookieStore.get("sb-access-token")) {
    console.error("[auth/callback] exchange failed or cookies not set", error);

    // Redirect to manual code entry page
    return NextResponse.redirect(`${origin}/auth/verify?code=${code}`);
  }

  // Success! Redirect to app.
  return NextResponse.redirect(`${origin}/app`);
}
