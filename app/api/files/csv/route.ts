export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body?.title || "Solace CSV";
    const rows = body?.rows || [];

    const filename = slugFromText(title, "csv");

    const csv = rows.map((r: any[]) =>
      r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = await put(`exports/${filename}`, csv, {
      access: "public",
      contentType: "text/csv",
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      filename,
      type: "csv",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
