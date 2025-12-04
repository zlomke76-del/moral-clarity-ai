import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();

  let supabaseStatus: "ok" | "error" = "ok";
  let errorMessage: string | null = null;

  try {
    // Lazy import inside the handler — required for Next 16
    const { supabaseServer } = await import("@/lib/supabase");

    const sb = await supabaseServer();

    const { error } = await sb
      .from("health_check")
      .select("id")
      .limit(1);

    if (error) {
      supabaseStatus = "error";
      errorMessage = error.message;
    }
  } catch (err: any) {
    supabaseStatus = "error";
    errorMessage = err?.message || "Unknown error";
  }

  return NextResponse.json(
    {
      uptime_ms: Date.now() - start,
      supabase: supabaseStatus,
      error: errorMessage,
    },
    { status: supabaseStatus === "ok" ? 200 : 500 }
  );
}
