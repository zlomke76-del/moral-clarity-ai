// app/auth/start/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = form.get("email")?.toString();

  if (!email) {
    return NextResponse.redirect("/auth/error?err=Missing%20email");
  }

  const cookieStore = await cookies();

  // Build and store callback redirect info
  const params = new URLSearchParams();
  params.set("next", "/app");

  cookieStore.set("auth-callback-search", params.toString(), {
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
          return cookieStore.get(name)?.value;
        },
        set(name, value, opts) {
          cookieStore.set(name, value, opts);
        },
        remove(name, opts) {
          cookieStore.set(name, "", { ...opts, maxAge: 0 });
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

  return NextResponse.redirect("/auth/check-email");
}
