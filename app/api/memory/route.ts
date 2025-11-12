// app/api/memory/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ================= CORS (mirrors /api/chat) ================= */
const STATIC_ALLOWED_ORIGINS = [
  "https://moralclarity.ai",
  "https://www.moralclarity.ai",
  "https://studio.moralclarity.ai",
  "https://studio-founder.moralclarity.ai",
  "https://moralclarityai.com",
  "https://www.moralclarityai.com",
  "http://localhost:3000",
];
const ENV_ALLOWED_ORIGINS = (process.env.MCAI_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_SET = new Set<string>([
  ...STATIC_ALLOWED_ORIGINS,
  ...ENV_ALLOWED_ORIGINS,
]);

function hostIsAllowedWildcard(hostname: string) {
  return (
    /^([a-z0-9-]+\.)*moralclarity\.ai$/i.test(hostname) ||
    /^([a-z0-9-]+\.)*moralclarityai\.com$/i.test(hostname)
  );
}
function pickAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try {
    if (ALLOWED_SET.has(origin)) return origin;
    const url = new URL(origin);
    if (hostIsAllowedWildcard(url.hostname)) return origin;
  } catch {}
  return null;
}
function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, X-User-Key");
  h.set("Access-Control-Max-Age", "86400");
  if (origin) h.set("Access-Control-Allow-Origin", origin);
  return h;
}

/* ================= Utils ================= */
const DEBUG = process.env.NODE_ENV !== "production";

function getUserKey(req: NextRequest): string {
  const url = new URL(req.url);
  // Priority: explicit header → query param → env default → "guest"
  return (
    req.headers.get("x-user-key") ||
    url.searchParams.get("user_key") ||
    process.env.NEXT_PUBLIC_MCA_USER_KEY ||
    "guest"
  );
}

function badRequest(msg: string, origin: string | null) {
  return NextResponse.json({ ok: false, error: msg }, { status: 400, headers: corsHeaders(origin) });
}

/* ================= OPTIONS (CORS preflight) ================= */
export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/* ================= GET: recent memories for user_key ================= */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));
  try {
    const url = new URL(req.url);
    const user_key = getUserKey(req);
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
    const kind = url.searchParams.get("kind"); // optional: 'profile' | 'preference' | 'fact' | 'task' | 'note'

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.error("Memory route missing Supabase envs", {
          hasUrl: !!process.env.SUPABASE_URL,
          hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        });
      }
      return badRequest("Server not configured for memory access.", origin);
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );

    let q = supabase
      .from("user_memories")
      .select("id,title,content,created_at,user_key,kind")
      .eq("user_key", user_key)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (kind) q = q.eq("kind", kind);

    const { data, error } = await q;

    if (error) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.error("Supabase query error (/api/memory):", error);
      }
      return NextResponse.json(
        { ok: false, error: error.message || String(error) },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    return NextResponse.json(
      { ok: true, rows: data ?? [], user_key },
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error("Memory route unhandled error:", err);
    }
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
