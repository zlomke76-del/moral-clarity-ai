// app/api/files/csv/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || undefined;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const title = (body?.title as string) || "Solace Export";
    const raw = (body?.content as string) || "";

    if (!raw.trim()) {
      return NextResponse.json(
        { ok: false, error: "No content provided to export." },
        { status: 400 }
      );
    }

    const filename = slugFromText(title, "csv");

    // Very simple CSV: treat each line as a row, escape quotes.
    const csv = raw
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line: string) => `"${line.replace(/"/g, '""')}"`)
      .join("\n");

    const buf = Buffer.from(csv, "utf-8");

    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType: "text/csv; charset=utf-8",
      token: BLOB_TOKEN,
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
