import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase";

export async function GET() {
  const start = Date.now();

  try {
    const sb = createClientServer();

    const { error } = await sb
      .from("health_check")
      .select("id")
      .limit(1);

    return NextResponse.json({
      uptime_ms: Date.now() - start,
      supabase: error ? "error" : "ok",
      error: error?.message ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        uptime_ms: Date.now() - start,
        supabase: "error",
        error: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
