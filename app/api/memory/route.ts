export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ---------------------- CORS ---------------------- */
const STATIC_ALLOWED_ORIGINS = [
  "https://moralclarity.ai",
  "https://www.moralclarity.ai",
  "https://studio.moralclarity.ai",
  "https://studio-founder.moralclarity.ai",
  "https://moralclarityai.com",
  "https://www.moralclarityai.com",
  "http://localhost:3000",
];

const ENV_DYNAMIC_ORIGINS = (process.env.MCAI_ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const ALLOWED = new Set([...STATIC_ALLOWED_ORIGINS, ...ENV_DYNAMIC_ORIGINS]);

function pickOrigin(origin: string | null) {
  if (!origin) return null;
  if (ALLOWED.has(origin)) return origin;
  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith("moralclarity.ai")) return origin;
    if (hostname.endsWith("moralclarityai.com")) return origin;
  } catch {}
  return null;
}

function cors(origin: string | null) {
  const h = new Headers();
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, X-User-Key");
  h.set("Access-Control-Max-Age", "86400");
  if (origin) h.set("Access-Control-Allow-Origin", origin);
  return h;
}

/* ---------------------- UTILS ---------------------- */

function getUserKeyFrom(req: NextRequest): string {
  const header = req.headers.get("x-user-key");
  const qp = new URL(req.url).searchParams.get("user_key");
  return header || qp || "guest";
}

function bad(msg: string, origin: string | null) {
  return NextResponse.json({ ok: false, error: msg }, { status: 400, headers: cors(origin) });
}

/* ---------------------- OPTIONS ---------------------- */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: cors(pickOrigin(req.headers.get("origin"))),
  });
}

/* ---------------------- GET: Read memories ---------------------- */

export async function GET(req: NextRequest) {
  const origin = pickOrigin(req.headers.get("origin"));

  const user_key = getUserKeyFrom(req);
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
  const kind = url.searchParams.get("kind");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  let query = supabase
    .from("user_memories")
    .select("id,title,content,created_at,purpose,kind,workspace_id,user_key,weight")
    .eq("user_key", user_key)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (kind) query = query.eq("kind", kind);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500, headers: cors(origin) }
    );
  }

  return NextResponse.json(
    { ok: true, rows: data },
    { headers: cors(origin) }
  );
}

/* ---------------------- POST: Create a memory ---------------------- */

export async function POST(req: NextRequest) {
  const origin = pickOrigin(req.headers.get("origin"));

  const body: any = await req.json().catch(() => null);
  if (!body) return bad("Invalid JSON.", origin);

  const user_key = getUserKeyFrom(req);
  const content = (body.content || "").trim();
  if (!content) return bad("Missing content.", origin);

  const payload = {
    user_key,
    title: body.title || null,
    content,
    purpose: body.purpose || "note",
    kind: body.kind || "note",
    workspace_id: body.workspace_id || null,
    weight: body.weight || 1,
  };

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("user_memories")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500, headers: cors(origin) }
    );
  }

  return NextResponse.json(
    { ok: true, row: data },
    { status: 201, headers: cors(origin) }
  );
}
