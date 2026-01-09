// app/api/rolodex/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const runtime = "nodejs";

type RolodexRow = {
  id?: string;
  user_id?: string;
  name?: string | null;
  titles?: any;
  emails?: any;
  contact_info?: any;
  notes?: string | null;
  tags?: string[] | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
};

function truthy(v: string | null): boolean {
  if (!v) return false;
  const s = v.toLowerCase().trim();
  return s === "1" || s === "true" || s === "yes" || s === "on";
}

function getDiagEnabled(req: Request): boolean {
  const url = new URL(req.url);
  const qp = url.searchParams.get("diag");
  if (truthy(qp)) return true;
  const hdr = req.headers.get("x-solace-diag");
  return truthy(hdr);
}

function safeError(e: any) {
  // supabase-js / postgrest error objects commonly include these fields
  return {
    message: e?.message ?? String(e),
    code: e?.code ?? null,
    details: e?.details ?? null,
    hint: e?.hint ?? null,
    status: e?.status ?? null,
    name: e?.name ?? null,
  };
}

function toStatus(errStatus?: number | null): number {
  // Preserve meaningful upstream statuses when present; otherwise treat as 500.
  if (!errStatus) return 500;
  if (errStatus >= 200 && errStatus <= 599) return errStatus;
  return 500;
}

async function makeSupabase() {
  const cookieStore = await cookies(); // ✅ Next.js 16: cookies() is async

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env vars. Need NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL/SUPABASE_ANON_KEY)."
    );
  }

  // Route handlers can set cookies (for refresh) via cookieStore.set if needed.
  // createServerClient expects a cookie adapter; in Next 16 we implement get/set/remove.
  const supabase = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // In some runtimes/contexts Next may throw on set; ignore to avoid crashing.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // ignore
        }
      },
    },
  });

  return supabase;
}

/**
 * Unified response helper:
 * - if diag enabled: returns payload + diag
 * - otherwise: returns payload only
 */
function respond(
  payload: any,
  diagEnabled: boolean,
  diag: any,
  status = 200
) {
  if (diagEnabled) {
    return NextResponse.json({ ...payload, diag }, { status });
  }
  return NextResponse.json(payload, { status });
}

export async function GET(req: Request) {
  const diagEnabled = getDiagEnabled(req);
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  const diag: any = {
    requestId,
    route: "/api/rolodex",
    method: "GET",
    startedAt: new Date().toISOString(),
    elapsedMs: null as number | null,
    supabase: {
      urlPresent: !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
      ),
      anonPresent: !!(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
      ),
      authUserOk: null as boolean | null,
      userId: null as string | null,
    },
    query: {
      schema: "memory",
      table: "rolodex",
      status: null as number | null,
      error: null as any,
      rowCount: null as number | null,
    },
  };

  try {
    const supabase = await makeSupabase();

    // ✅ verify auth + get uid
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      diag.supabase.authUserOk = false;
      diag.query.status = toStatus((userErr as any)?.status);
      diag.query.error = safeError(userErr);
      diag.elapsedMs = Date.now() - startedAt;

      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond(
        { ok: false, error: "Unauthorized" },
        diagEnabled,
        diag,
        401
      );
    }

    const uid = userData?.user?.id || null;
    diag.supabase.authUserOk = !!uid;
    diag.supabase.userId = uid;

    if (!uid) {
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond(
        { ok: false, error: "Unauthorized" },
        diagEnabled,
        diag,
        401
      );
    }

    // ✅ Explicit schema targeting: memory.rolodex
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim() || "";
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") || "200", 10), 1),
      500
    );

    let query = supabase
      .schema("memory")
      .from("rolodex")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(limit);

    // optional search if your table has a "name" field (safe, won’t break if nulls)
    if (q) {
      // If you want multi-field search later, we can expand this.
      query = query.ilike("name", `%${q}%`);
    }

    const { data, error, status } = await query;

    diag.query.status = status ?? null;

    if (error) {
      diag.query.error = safeError(error);
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      const s = toStatus((error as any)?.status);
      return respond(
        { ok: false, error: "Rolodex query failed" },
        diagEnabled,
        diag,
        s
      );
    }

    diag.query.rowCount = Array.isArray(data) ? data.length : 0;
    diag.elapsedMs = Date.now() - startedAt;

    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond({ ok: true, rows: data ?? [] }, diagEnabled, diag, 200);
  } catch (e: any) {
    diag.query.error = safeError(e);
    diag.elapsedMs = Date.now() - startedAt;

    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond(
      { ok: false, error: "Internal Server Error" },
      diagEnabled,
      diag,
      500
    );
  }
}

export async function POST(req: Request) {
  const diagEnabled = getDiagEnabled(req);
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  const diag: any = {
    requestId,
    route: "/api/rolodex",
    method: "POST",
    startedAt: new Date().toISOString(),
    elapsedMs: null as number | null,
    supabase: {
      authUserOk: null as boolean | null,
      userId: null as string | null,
    },
    insert: {
      schema: "memory",
      table: "rolodex",
      status: null as number | null,
      error: null as any,
    },
  };

  try {
    const supabase = await makeSupabase();

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user?.id) {
      diag.supabase.authUserOk = false;
      diag.insert.error = safeError(userErr);
      diag.elapsedMs = Date.now() - startedAt;

      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond(
        { ok: false, error: "Unauthorized" },
        diagEnabled,
        diag,
        401
      );
    }

    const uid = userData.user.id;
    diag.supabase.authUserOk = true;
    diag.supabase.userId = uid;

    const body = (await req.json().catch(() => ({}))) as RolodexRow;

    // enforce user_id (RLS expects auth.uid() = user_id)
    const row: RolodexRow = {
      ...body,
      user_id: uid,
    };

    const { data, error, status } = await supabase
      .schema("memory")
      .from("rolodex")
      .insert(row)
      .select("*")
      .single();

    diag.insert.status = status ?? null;

    if (error) {
      diag.insert.error = safeError(error);
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      const s = toStatus((error as any)?.status);
      return respond(
        { ok: false, error: "Rolodex insert failed" },
        diagEnabled,
        diag,
        s
      );
    }

    diag.elapsedMs = Date.now() - startedAt;
    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond({ ok: true, row: data }, diagEnabled, diag, 200);
  } catch (e: any) {
    diag.insert.error = safeError(e);
    diag.elapsedMs = Date.now() - startedAt;

    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond(
      { ok: false, error: "Internal Server Error" },
      diagEnabled,
      diag,
      500
    );
  }
}

export async function PATCH(req: Request) {
  const diagEnabled = getDiagEnabled(req);
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  const diag: any = {
    requestId,
    route: "/api/rolodex",
    method: "PATCH",
    startedAt: new Date().toISOString(),
    elapsedMs: null as number | null,
    supabase: { authUserOk: null as boolean | null, userId: null as string | null },
    update: { schema: "memory", table: "rolodex", status: null as number | null, error: null as any },
  };

  try {
    const supabase = await makeSupabase();

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user?.id) {
      diag.supabase.authUserOk = false;
      diag.update.error = safeError(userErr);
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond({ ok: false, error: "Unauthorized" }, diagEnabled, diag, 401);
    }

    const uid = userData.user.id;
    diag.supabase.authUserOk = true;
    diag.supabase.userId = uid;

    const body = (await req.json().catch(() => ({}))) as RolodexRow;
    const id = (body?.id || "").toString();

    if (!id) {
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond({ ok: false, error: "Missing id" }, diagEnabled, diag, 400);
    }

    // never allow changing user_id
    const { user_id, id: _id, created_at, ...patch } = body as any;

    const { data, error, status } = await supabase
      .schema("memory")
      .from("rolodex")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    diag.update.status = status ?? null;

    if (error) {
      diag.update.error = safeError(error);
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      const s = toStatus((error as any)?.status);
      return respond({ ok: false, error: "Rolodex update failed" }, diagEnabled, diag, s);
    }

    diag.elapsedMs = Date.now() - startedAt;
    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond({ ok: true, row: data }, diagEnabled, diag, 200);
  } catch (e: any) {
    diag.update.error = safeError(e);
    diag.elapsedMs = Date.now() - startedAt;
    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond({ ok: false, error: "Internal Server Error" }, diagEnabled, diag, 500);
  }
}

export async function DELETE(req: Request) {
  const diagEnabled = getDiagEnabled(req);
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  const diag: any = {
    requestId,
    route: "/api/rolodex",
    method: "DELETE",
    startedAt: new Date().toISOString(),
    elapsedMs: null as number | null,
    supabase: { authUserOk: null as boolean | null, userId: null as string | null },
    delete: { schema: "memory", table: "rolodex", status: null as number | null, error: null as any },
  };

  try {
    const supabase = await makeSupabase();

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user?.id) {
      diag.supabase.authUserOk = false;
      diag.delete.error = safeError(userErr);
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond({ ok: false, error: "Unauthorized" }, diagEnabled, diag, 401);
    }

    const uid = userData.user.id;
    diag.supabase.authUserOk = true;
    diag.supabase.userId = uid;

    const url = new URL(req.url);
    const id = (url.searchParams.get("id") || "").trim();

    if (!id) {
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      return respond({ ok: false, error: "Missing id" }, diagEnabled, diag, 400);
    }

    const { error, status } = await supabase
      .schema("memory")
      .from("rolodex")
      .delete()
      .eq("id", id);

    diag.delete.status = status ?? null;

    if (error) {
      diag.delete.error = safeError(error);
      diag.elapsedMs = Date.now() - startedAt;
      if (diagEnabled) console.log("[rolodex][DIAG]", diag);

      const s = toStatus((error as any)?.status);
      return respond({ ok: false, error: "Rolodex delete failed" }, diagEnabled, diag, s);
    }

    diag.elapsedMs = Date.now() - startedAt;
    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond({ ok: true }, diagEnabled, diag, 200);
  } catch (e: any) {
    diag.delete.error = safeError(e);
    diag.elapsedMs = Date.now() - startedAt;
    if (diagEnabled) console.log("[rolodex][DIAG]", diag);

    return respond({ ok: false, error: "Internal Server Error" }, diagEnabled, diag, 500);
  }
}
