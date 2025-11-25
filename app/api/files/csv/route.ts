// app/api/files/csv/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { headers = [], rows = [], filename = "export.csv" } =
      await req.json().catch(() => ({}));

    if (!Array.isArray(headers) || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Invalid CSV structure" },
        { status: 400 }
      );
    }

    const escape = (v: any) => {
      if (v == null) return "";
      const s = String(v);
      if (s.includes('"') || s.includes(",") || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csv =
      "\uFEFF" +
      [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");

    const b64 = Buffer.from(csv, "utf8").toString("base64");

    return NextResponse.json({
      ok: true,
      filename,
      mime: "text/csv",
      base64: b64,
      download_url: `data:text/csv;base64,${b64}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "CSV generation failed." },
      { status: 500 }
    );
  }
}
