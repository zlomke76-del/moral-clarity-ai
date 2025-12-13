// app/api/research/hubble/events/route.ts
// ------------------------------------------------------------
// READ-ONLY HUBBLE EVENT RETRIEVAL
// - Immutable events only
// - No mutation
// - No memory interaction
// - Diagnostic transparency included
// ------------------------------------------------------------

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function jsonError(message: string, status = 400, extra = {}) {
  return NextResponse.json(
    { ok: false, error: message, ...extra },
    { status }
  );
}

// ------------------------------------------------------------
// GET /research/hubble/events
// Query params:
// - limit (default 25, max 100)
// - since (ISO timestamp, optional)
// ------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const limit = Math.min(
      Number(searchParams.get("limit") ?? 25),
      100
    );

    const since = searchParams.get("since");

    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // --------------------------------------------------------
    // READ-ONLY QUERY — ISOLATED NAMESPACE
    // --------------------------------------------------------
    let query = supabase
      .schema("research")
      .from("hubble_ingest_v1")
      .select("*")
      .order("timestamp_utc", { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gte("timestamp_utc", since);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[HUBBLE READ] query error", error);
      return jsonError("Failed to read Hubble events", 500, {
        code: "HUBBLE_READ_FAILED",
      });
    }

    // --------------------------------------------------------
    // DIAGNOSTICS (CRITICAL FOR DRIFT AUDIT)
    // --------------------------------------------------------
    const diag = {
      count: data?.length ?? 0,
      limit,
      since: since ?? null,
      namespace: "research.hubble_ingest_v1",
      immutable: true,
      timestamp_utc: new Date().toISOString(),
    };

    console.info("[HUBBLE READ DIAG]", diag);

    return NextResponse.json({
      ok: true,
      events: data ?? [],
      diag,
    });
  } catch (err: any) {
    console.error("[HUBBLE READ FATAL]", err);
    return jsonError(
      err?.message || "Unexpected Hubble read error",
      500,
      { code: "HUBBLE_READ_FATAL" }
    );
  }
}
