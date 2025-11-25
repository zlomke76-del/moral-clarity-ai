// app/api/files/docx/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body?.title || "Solace Document";
    const text = body?.content || "";

    const filename = slugFromText(title, "docx");

    // Call Python worker to generate DOCX binary
    const py = await fetch(process.env.PY_WORKER_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PY_WORKER_KEY}`,
      },
      body: JSON.stringify({
        type: "docx",
        title,
        content: text,
      }),
    });

    if (!py.ok) {
      return NextResponse.json(
        { ok: false, error: "DOCX worker error" },
        { status: 500 }
      );
    }

    const buf = Buffer.from(await py.arrayBuffer());

    // Upload to Vercel Blob with overwrite allowed
    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      addRandomSuffix: false,
      allowOverwrite: true,        // 🔥 THIS FIXES YOUR ERROR
    });

    return NextResponse.json({
      ok: true,
      url: blob.url,
      filename,
      type: "docx",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
