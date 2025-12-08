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
    // ⭐ RAW COOKIE HEADER — required in Next 16
    // Supabase MUST parse the incoming cookie header itself.
    // ------------------------------------------------------------
    const cookieHeader = req.headers.get("cookie") ?? "";
    diag.cookieHeader = cookieHeader;

    // ------------------------------------------------------------
    // ⭐ PREPARE RESPONSE (cookies will be attached here)
    // ------------------------------------------------------------
    const response = NextResponse.json({ stage: "pre-exchange" });

    // ------------------------------------------------------------
    // ⭐ SUPABASE SERVER CLIENT — with full manual cookie adapter
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
    // ⭐ SET SESSION — this is the handshake
    // ------------------------------------------------------------
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    diag.supabase = {
      receivedSession: !!data?.session,
      error,
    };

    if (error || !data?.session) {
      diag.stage = "session-failed";
      response.headers.set("x-mc-diag", JSON.stringify(diag));
      return NextResponse.json({ error: "SetSessionFailed", diag }, { status: 400 });
    }

    // ------------------------------------------------------------
    // SUCCESS — attach full diag to body
    // ------------------------------------------------------------
    diag.stage = "success";
    return NextResponse.json({ success: true, diag }, { status: 200 });
  } catch (err: any) {
    diag.stage = "exception";
    diag.error = err?.message;
    return NextResponse.json({ error: "Exception", diag }, { status: 500 });
  }
}

