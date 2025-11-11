// app/api/health/route.ts
import { NextResponse } from "next/server";

// server runtime (not edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Optional: pull workspace id from code config if present
let CONFIG_WORKSPACE_ID: string | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CONFIG_WORKSPACE_ID = require("@/lib/mca-config").MCA_WORKSPACE_ID ?? null;
} catch {
  CONFIG_WORKSPACE_ID = null;
}

const ORIGIN_LIST = [
  "https://moralclarity.ai",
  "https://www.moralclarity.ai",
  "https://studio.moralclarity.ai",
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ORIGIN_LIST.includes(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin! : "null",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store",
  };
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(req: Request) {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  const ok = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const memoryEnabled = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webFlag =
    process.env.NEXT_PUBLIC_OPENAI_WEB_ENABLED_flag ??
    process.env.OPENAI_WEB_ENABLED_flag ??
    null;

  // --- Workspace & memory diagnostics (best-effort) ---
  let workspace = {
    id: CONFIG_WORKSPACE_ID || process.env.MCA_WORKSPACE_ID || null,
    memories: null as number | null,
    userMemories: null as number | null,
    quotaMb: null as number | null,
  };

  if (memoryEnabled && (workspace.id || true)) {
    try {
      // lazy import to keep route light if env is missing
      const { supabaseService } = await import("@/lib/supabase");

      const sb = supabaseService();

      // Workspace memories count (mca.memories)
      if (workspace.id) {
        const { count: wsCount } = await sb
          .schema("mca")
          .from("memories")
          .select("id", { count: "exact", head: true })
          .eq("workspace_id", workspace.id);
        workspace.memories = typeof wsCount === "number" ? wsCount : null;
      }

      // User memories (public.user_memories) for the default user_key `guest`
      const { count: userCount } = await sb
        .from("user_memories")
        .select("id", { count: "exact", head: true })
        .eq("user_key", "guest");
      workspace.userMemories = typeof userCount === "number" ? userCount : null;

      // Optional quota (if stored in env or entitlements)
      const quota =
        Number(process.env.ATTACHMENTS_MAX_MB || process.env.MEMORY_MAX_MB || "") || null;
      workspace.quotaMb = quota;
    } catch {
      // swallow errors; keep health green if core envs are fine
    }
  }

  return NextResponse.json(
    {
      ok,
      message: "Moral Clarity AI backend responding correctly.",
      memoryEnabled,
      flags: { webEnabled: !!webFlag },
      timestamps: { server: new Date().toISOString() },
      env: {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      workspace,
    },
    { headers }
  );
}
