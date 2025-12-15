import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/sign-in`);
  }

  // Next.js 16 cookies API
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
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

  // ✅ PKCE exchange — requires intact code_verifier cookie
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange failed", error);
    return NextResponse.redirect(`${origin}/auth/sign-in`);
  }

  // ✅ OPTIONAL: cleanup malformed legacy cookies AFTER exchange
  for (const c of cookieStore.getAll()) {
    if (
      c.name.startsWith("sb-") &&
      !c.value.startsWith("{") && // crude but effective JSON guard
      !c.name.includes("code-verifier")
    ) {
      cookieStore.set({
        name: c.name,
        value: "",
        path: "/",
        maxAge: 0,
      });
    }
  }

  return NextResponse.redirect(`${origin}/app`);
}
