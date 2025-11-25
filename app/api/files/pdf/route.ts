// app/api/files/pdf/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body?.title || "Solace PDF";
    const text = body?.content || "";

    const filename = slugFromText(title, "pdf");

    const py = await fetch(process.env.PY_WORKER_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PY_WORKER_KEY}`,
      },
      body: JSON.stringify({
        type: "pdf",
        title,
        content: text,
      }),
    });

    if (!py.ok) {
      return NextResponse.json({ error: "PDF worker error" }, { status: 500 });
    }

    const buf = Buffer.from(await py.arrayBuffer());

    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType: "application/pdf",
      allowOverwrite: true,
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      filename,
      type: "pdf",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
