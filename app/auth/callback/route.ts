// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OTP_TYPES = new Set<string>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function resolveRedirectPath(req: NextRequest) {
  const url = req.nextUrl;
  const requested =
    url.searchParams.get("redirect") ??
    url.searchParams.get("redirectedFrom") ??
    url.searchParams.get("next") ??
    "/app";

  // Only allow same-site relative redirects. This prevents open redirects while
  // preserving deep links such as /admin or /w/{workspaceId} after sign-in.
  if (!requested.startsWith("/") || requested.startsWith("//")) {
    return "/app";
  }

  if (requested.startsWith("/auth/")) {
    return "/app";
  }

  return requested;
}

function redirectWithReason(req: NextRequest, reason: string) {
  const target = new URL("/auth/sign-in", req.url);
  target.searchParams.set("error", reason);
  return NextResponse.redirect(target);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const redirectPath = resolveRedirectPath(req);

  if (!code && (!tokenHash || !type || !OTP_TYPES.has(type))) {
    return redirectWithReason(req, "Invalid or expired sign-in link.");
  }

  let response = NextResponse.redirect(new URL(redirectPath, req.url));

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

  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({
        token_hash: tokenHash!,
        type: type as EmailOtpType,
      });

  if (error) {
    console.error("[auth/callback] session exchange failed", error);
    return redirectWithReason(req, error.message || "Sign-in failed.");
  }

  return response;
}
