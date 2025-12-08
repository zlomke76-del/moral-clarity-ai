export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

    // Prepare the JSON response where we will attach cookies.
    const response = NextResponse.json({ stage: "pre-exchange" });

    // 🚫 FIX: cookies() must NOT be awaited — keep it synchronous
    const cookieStore = cookies();

    // Writable cookie adapter for Supabase
    const cookieAdapter = {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        response.cookies.set(name, value, options);
        diag.cookieSet = diag.cookieSet || [];
        diag.cookieSet.push({
          name,
          valueMasked: value?.slice?.(0, 6) + "...",
          options,
        });
      },
      remove(name: string, options: any) {
        response.cookies.set(name, "", { ...options, maxAge: 0 });
        diag.cookieRemoved = diag.cookieRemoved || [];
        diag.cookieRemoved.push({ name });
      },
    };

    diag.stage = "create-client";

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookieAdapter,
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
    return NextResponse.json({ success: true, diag }, response);
  } catch (err: any) {
    diag.stage = "exception";
    diag.exception = err?.message;

    return NextResponse.json({ error: "Exception", diag }, { status: 500 });
  }
}
