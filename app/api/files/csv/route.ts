// app/api/files/csv/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body?.title || "Solace CSV";
    const text = body?.content || "";

    const filename = slugFromText(title, "csv");

    // Convert raw content to CSV-safe format
    const csv = text
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => `"${line.replace(/"/g, '""')}"`)
      .join("\n");

    const buf = Buffer.from(csv, "utf-8");

    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType: "text/csv",
      allowOverwrite: true,
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
