// app/auth/exchange/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: Request) {
  const diag: Record<string, any> = { stage: "start" };

  try {
    const body = await req.json();
    const access_token = body.access_token;
    const refresh_token = body.refresh_token;

    diag.incoming = {
      access_token_present: !!access_token,
      refresh_token_present: !!refresh_token,
    };

    if (!access_token || !refresh_token) {
      diag.stage = "missing-tokens";
      return NextResponse.json(
        { error: "MissingTokens", diag },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // ⭐ RAW COOKIE HEADER (Next.js 16 requirement)
    // ------------------------------------------------------------
    const cookieHeader = req.headers.get("cookie") ?? "";
    diag.cookieHeader = cookieHeader;

    // ------------------------------------------------------------
    // ⭐ THIS RESPONSE is where Supabase will write cookies
    // ------------------------------------------------------------
    const response = NextResponse.json({ stage: "exchanging-session" });

    // ------------------------------------------------------------
    // ⭐ CREATE SUPABASE CLIENT with MANUAL COOKIE ADAPTER
    // ------------------------------------------------------------
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            const raw = cookieHeader
              .split(";")
              .map((x) => x.trim())
              .find((x) => x.startsWith(name + "="));
            return raw ? raw.split("=")[1] : undefined;
          },
          set(name, value, options) {
            response.cookies.set(name, value, options);
            (diag.setCookies ||= []).push({
              name,
              valueMasked: value?.slice?.(0, 6) + "...",
              options,
            });
          },
          remove(name, options) {
            response.cookies.set(name, "", { ...options, maxAge: 0 });
            (diag.removedCookies ||= []).push({ name });
          },
        },
      }
    );

    diag.stage = "set-session";

    // ------------------------------------------------------------
    // ⭐ SUPER IMPORTANT — THIS HANDSHAKE SETS YOUR SESSION
    // ------------------------------------------------------------
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    diag.supabase = {
      sessionCreated: !!data?.session,
      error,
    };

    if (error || !data?.session) {
      diag.stage = "session-failed";
      const failResponse = NextResponse.json(
        { error: "SetSessionFailed", diag },
        { status: 400 }
      );
      return failResponse;
    }

    // ------------------------------------------------------------
    // ⭐ SUCCESS — RETURN THE SAME RESPONSE WITH COOKIES ATTACHED
    // ------------------------------------------------------------
    diag.stage = "success";
    response.headers.set("x-mc-diag", JSON.stringify(diag));

    return response;
  } catch (err: any) {
    diag.stage = "exception";
    diag.error = err?.message;

    return NextResponse.json(
      { error: "Exception", diag },
      { status: 500 }
    );
  }
}

