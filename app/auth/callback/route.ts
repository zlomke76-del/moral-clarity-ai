// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  const diag: Record<string, any> = { stage: "start" };

  try {
    // MUST AWAIT — new Next.js 16 API
    const cookieStore = await cookies();

    // Safe diagnostic
    diag.cookiesBefore = cookieStore.getAll().map((c) => ({
      name: c.name,
      value: c.value,
    }));

    const raw = cookieStore.get("auth-callback-search")?.value ?? "";
    diag.rawSearch = raw;

    const search = new URLSearchParams(raw);

    const code = search.get("code");
    const next = search.get("next") || "/app";

    diag.code = code;
    diag.next = next;

    if (!code) {
      diag.error = "Missing code";
      if (debug) return NextResponse.json(diag);
      return NextResponse.redirect(
        `${url.origin}/auth/error?err=Missing%20code`
      );
    }

    diag.stage = "create-supabase";

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    diag.stage = "exchange";

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    diag.exchangeError = error ?? null;
    diag.sessionReturned = !!data?.session;

    if (error || !data?.session) {
      diag.stage = "failed";
      if (debug) return NextResponse.json(diag);
      return NextResponse.redirect(
        `${url.origin}/auth/error?err=Auth%20session%20failed`
      );
    }

    diag.stage = "success";

    if (debug) return NextResponse.json(diag);

    return NextResponse.redirect(`${url.origin}${next}`);
  } catch (err: any) {
    diag.stage = "exception";
    diag.exception = err?.message;
    return NextResponse.json(diag, { status: 500 });
  }
}
