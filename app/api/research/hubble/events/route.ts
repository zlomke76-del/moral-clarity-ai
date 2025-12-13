export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // ✅ FIX: cookies() is synchronous in Next 16
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data, error } = await supabase
      .schema("research")
      .from("hubble_ingest_v1")
      .select("*")
      .order("timestamp_utc", { ascending: false })
      .limit(10);

    if (error) {
      console.error("[HUBBLE EVENTS READ ERROR]", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      count: data?.length ?? 0,
      events: data ?? [],
    });
  } catch (err: any) {
    console.error("[HUBBLE EVENTS ROUTE FATAL]", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
