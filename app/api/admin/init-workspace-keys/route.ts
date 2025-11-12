<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { initWorkspaceKey } from "@/server/memory-utils";
=======
// app/api/admin/init-workspace-keys/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
>>>>>>> origin/speedinsights-install

export const runtime = "nodejs";

<<<<<<< HEAD
export async function POST(request: Request) {
  const { workspaceId } = await request.json();
  if (!workspaceId) {
    return NextResponse.json({ ok: false, error: "workspaceId required" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
        set: () => {},
        remove: () => {},
      } as any,
    }
  );

  const ref = await initWorkspaceKey(supabase as any, workspaceId);
  return NextResponse.json({ ok: true, ref });
=======
export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon || !service) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing Supabase env",
        missing: {
          NEXT_PUBLIC_SUPABASE_URL: !!url,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: !!anon,
          SUPABASE_SERVICE_ROLE_KEY: !!service,
        },
      },
      { status: 200 }
    );
  }

  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-app": "moralclarity-studio" } },
  });

  try {
    // TODO: your real init logic; keep ALL DB calls in here
    const { error } = await admin.from("workspace_keys").select("id").limit(1).maybeSingle();
    if (error) console.error("[init-workspace-keys] select error:", error.message);
  } catch (e: any) {
    console.error("[init-workspace-keys] runtime error:", e?.message ?? e);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "admin/init-workspace-keys" });
>>>>>>> origin/speedinsights-install
}
