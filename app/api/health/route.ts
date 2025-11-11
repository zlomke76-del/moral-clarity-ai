// app/api/health/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    },
    { headers }
  );
}
