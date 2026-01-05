import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = form.get("email")?.toString();

  if (!email) {
    return NextResponse.redirect("/auth/error?err=Missing%20email");
  }

  // Create a mutable response
  const response = NextResponse.redirect("/auth/check-email");

  // Store callback redirect info
  const params = new URLSearchParams();
  params.set("next", "/app");
  response.cookies.set("auth-callback-search", params.toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.headers.get("cookie")?.match(new RegExp(`${name}=([^;]+)`))?.[1];
        },
        set(name, value, options) {
          response.cookies.set(name, value, options);
        },
        remove(name, options) {
          response.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return NextResponse.redirect(
      `/auth/error?err=${encodeURIComponent(error.message)}`
    );
  }

  return response;
}
