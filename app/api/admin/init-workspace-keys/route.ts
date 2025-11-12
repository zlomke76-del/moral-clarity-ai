// app/api/admin/init-workspace-keys/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // Guard env at runtime only (not at import time)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anon || !service) {
    // Don’t throw during build; return a clear message at runtime
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
      { status: 200 } // 200 so builds never fail here
    );
  }

  // All initialization stays inside the handler
  const admin = createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-app": "moralclarity-studio" } },
  });

  // Example: ensure a “workspace_keys” row exists (no-op if already there)
  // Replace with your real logic; keep all DB calls inside the handler.
  try {
    const { error } = await admin
      .from("workspace_keys")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (error) {
      // Log at runtime but don’t kill builds
      console.error("[init-workspace-keys] select error:", error.message);
    }
  } catch (e: any) {
    console.error("[init-workspace-keys] runtime error:", e?.message ?? e);
  }

  return NextResponse.json({ ok: true });
}

// Optional GET for quick health checks in browser
export async function GET() {
  return NextResponse.json({ ok: true, route: "admin/init-workspace-keys" });
}
