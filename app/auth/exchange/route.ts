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
    // ⭐ IMPORTANT:
    // Extract raw cookie header DIRECTLY from req.
    // This avoids Next.js 16's broken cookies() behavior.
    // ------------------------------------------------------------
    const cookieHeader = req.headers.get("cookie") ?? "";

    // Prepare response where cookies will be written
    const response = NextResponse.json({ stage: "pre-exchange" });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieHeader
              .split(";")
              .map((x) => x.trim())
              .find((x) => x.startsWith(name + "="))
              ?.split("=")[1];
          },
          set(name, value, options) {
            response.cookies.set(name, value, options);
            diag.cookieSet = diag.cookieSet || [];
            diag.cookieSet.push({
              name,
              valueMasked: value?.slice?.(0, 6) + "...",
              options,
            });
          },
          remove(name, options) {
            response.cookies.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    diag.stage = "set-session";

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    diag.supabase = {
      sessionReturned: !!data?.session,
      error: error ?? null,
    };

    if (error || !data?.session) {
      diag.stage = "session-failed";
      return NextResponse.json(
        { error: "SetSessionFailed", diag },
        { status: 400 }
      );
    }

    diag.stage = "success";
    return response;
  } catch (err: any) {
    diag.stage = "exception";
    diag.exception = err?.message;
    return NextResponse.json({ error: "Exception", diag }, { status: 500 });
  }
}

