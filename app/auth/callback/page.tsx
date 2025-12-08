// app/auth/callback/page.tsx
export const runtime = "nodejs";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export default async function AuthCallbackPage({
  searchParams
}: {
  searchParams?: Record<string, string>;
}) {
  const debug = searchParams?.debug === "1";
  const diag: any = { stage: "start" };

  try {
    const cookieStore = await cookies();

    diag.cookiesBefore = Object.fromEntries(
      cookieStore.getAll().map((c) => [c.name, c.value])
    );

    const raw = cookieStore.get("auth-callback-search")?.value ?? "";
    diag.rawSearch = raw;

    const search = new URLSearchParams(raw);
    const code = search.get("code");
    const next = search.get("next") || "/app";

    diag.code = code;
    diag.next = next;

    if (!code) {
      diag.error = "Missing code";
      if (debug) return Response.json(diag, { status: 400 });
      redirect("/auth/error?err=Missing%20code");
    }

    diag.stage = "creating-supabase-client";

    const cookieList = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieList.get(name)?.value;
          },
          set() {},
          remove() {}
        }
      }
    );

    diag.stage = "exchanging-code";

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    diag.exchangeData = data;
    diag.exchangeError = error;

    if (error || !data?.session) {
      diag.stage = "failed-exchange";
      if (debug) return Response.json(diag, { status: 500 });
      redirect("/auth/error?err=Auth%20session%20failed");
    }

    diag.stage = "success";

    if (debug) return Response.json(diag);

    redirect(next);
  } catch (err: any) {
    diag.stage = "exception";
    diag.exception = err?.message || String(err);
    return Response.json(diag, { status: 500 });
  }
}
