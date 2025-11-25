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
    const rows = body?.rows || [];

    const filename = slugFromText(title, "csv");

    // If rows are objects → convert to CSV
    const csv = convertToCsv(rows);
    const buf = Buffer.from(csv, "utf8");

    const blob = await put(`exports/${filename}`, buf, {
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

/**********************
 * CSV conversion helper
 **********************/
function convertToCsv(rows: any[]): string {
  if (!rows || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];

  for (const row of rows) {
    const line = headers
      .map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        const s = String(val).replace(/"/g, '""'); // escape quotes
        return `"${s}"`;
      })
      .join(",");
    lines.push(line);
  }

  return lines.join("\n");
}
