// app/auth/start/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveRedirectPath(req: NextRequest) {
  const url = req.nextUrl;
  const requested =
    url.searchParams.get("redirect") ??
    url.searchParams.get("redirectedFrom") ??
    "/app";

  if (!requested.startsWith("/") || requested.startsWith("//")) {
    return "/app";
  }

  if (requested.startsWith("/auth/")) {
    return "/app";
  }

  return requested;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = form.get("email")?.toString().trim().toLowerCase();

  if (!email) {
    return NextResponse.redirect(new URL("/auth/error?err=Missing%20email", req.url));
  }

  const redirectPath = resolveRedirectPath(req);
  const callbackUrl = new URL("/auth/callback", req.url);
  callbackUrl.searchParams.set("redirect", redirectPath);

  let response = NextResponse.redirect(new URL("/auth/check-email", req.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    const target = new URL("/auth/error", req.url);
    target.searchParams.set("err", error.message);
    return NextResponse.redirect(target);
  }

  return response;
}
