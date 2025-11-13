// app/api/memory/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { remember } from "@/lib/memory";

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
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, X-User-Key");
  h.set("Access-Control-Max-Age", "86400");
  if (origin) h.set("Access-Control-Allow-Origin", origin);
  return h;
}

/* ================= Utils ================= */
const DEBUG = process.env.NODE_ENV !== "production";

function getUserKey(req: NextRequest, fallback?: string | null): string {
  const url = new URL(req.url);
  // Priority: explicit header → query param → explicit fallback → env default → "guest"
  return (
    req.headers.get("x-user-key") ||
    url.searchParams.get("user_key") ||
    fallback ||
    process.env.NEXT_PUBLIC_MCA_USER_KEY ||
    "guest"
  );
}

function badRequest(msg: string, origin: string | null) {
  return NextResponse.json(
    { ok: false, error: msg },
    { status: 400, headers: corsHeaders(origin) }
  );
}

/* ================= OPTIONS (CORS preflight) ================= */
export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/* ================= GET: recent memories for user_key ================= */
/**
 * GET /api/memory
 * Query params:
 *   - user_key (optional; falls back to header/env/guest)
 *   - limit (optional; default 50, max 200)
 *   - kind  (optional; 'profile' | 'preference' | 'fact' | 'task' | 'note')
 */
export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));
  try {
    const url = new URL(req.url);
    const user_key = getUserKey(req);
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
    const kind = url.searchParams.get("kind"); // optional

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
      .select("id,title,content,created_at,user_key,kind,workspace_id")
      .eq("user_key", user_key)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (kind) q = q.eq("kind", kind);

    const { data, error } = await q;

    if (error) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.error("Supabase query error (/api/memory, GET):", error);
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
      console.error("Memory route unhandled error (GET):", err);
    }
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

/* ================= POST: create a new user memory ================= */
/**
 * POST /api/memory
 * Body JSON:
 *   {
 *     "content": string,               // required
 *     "title"?: string | null,
 *     "purpose"?: "profile" | "preference" | "fact" | "task" | "note" | "other",
 *     "user_key"?: string,             // optional, else X-User-Key/env/guest
 *     "workspace_id"?: string | null   // optional
 *   }
 *
 * This is language-agnostic: any content (Russian, Turkish, etc.) can be stored.
 */
export async function POST(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error("Memory route missing Supabase envs (POST)", {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
    }
    return badRequest("Server not configured for memory access.", origin);
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body.", origin);
  }

  const rawContent = (body?.content ?? "").toString().trim();
  if (!rawContent) {
    return badRequest("Missing 'content' in request body.", origin);
  }

  const explicitUserKey =
    typeof body?.user_key === "string" && body.user_key.trim().length > 0
      ? body.user_key.trim()
      : null;

  const user_key = getUserKey(req, explicitUserKey);
  const title =
    typeof body?.title === "string" ? body.title : body?.title ?? null;
  const purpose =
    typeof body?.purpose === "string" ? body.purpose : undefined;
  const workspace_id =
    typeof body?.workspace_id === "string" ? body.workspace_id : null;

  try {
    const row = await remember({
      user_key,
      content: rawContent,
      purpose: purpose as any, // validated downstream
      title,
      workspace_id,
    });

    return NextResponse.json(
      {
        ok: true,
        row,
      },
      { status: 201, headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error("Memory route unhandled error (POST):", err);
    }
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
