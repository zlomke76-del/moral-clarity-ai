import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClientServer } from "@/lib/supabase/server";

export async function GET() {
  const start = Date.now();

  let supabaseStatus: "ok" | "error" = "ok";
  let errorMessage: string | null = null;

  try {
    // Next.js 16: headers() must be awaited
    const hdr = await headers();
    const cookieHeader = hdr.get("cookie") ?? "";

    const sb = createClientServer(cookieHeader);

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
    errorMessage = err?.message ?? "Unknown error";
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
