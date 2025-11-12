// app/api/admin/init-workspace-keys/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
}
