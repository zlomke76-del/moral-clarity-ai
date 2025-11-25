export const runtime = "edge";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { slugFromText } from "@/lib/files/slug";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body?.title || "Solace PDF";
    const text = body?.content || "";

    const filename = slugFromText(title, "pdf");

    // Python worker endpoint (your internal)
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
      return NextResponse.json(
        { error: "PDF worker returned an error" },
        { status: 500 }
      );
    }

    const pdfBuffer = Buffer.from(await py.arrayBuffer());

    const blob = await put(`exports/${filename}`, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
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

