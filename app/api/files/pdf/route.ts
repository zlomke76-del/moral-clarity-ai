// app/api/files/pdf/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

const WORKER_URL = process.env.PY_WORKER_URL;
const WORKER_KEY = process.env.PY_WORKER_KEY;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || undefined;

export async function POST(req: NextRequest) {
  try {
    if (!WORKER_URL || !WORKER_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Export worker is not configured. Missing PY_WORKER_URL or PY_WORKER_KEY.",
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const title = (body?.title as string) || "Solace PDF";
    const text = (body?.content as string) || "";

    if (!text.trim()) {
      return NextResponse.json(
        { ok: false, error: "No content provided to export." },
        { status: 400 }
      );
    }

    const filename = slugFromText(title, "pdf");

    // Call Python worker to generate PDF binary
    const workerResp = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WORKER_KEY}`,
      },
      body: JSON.stringify({
        type: "pdf",
        title,
        content: text,
      }),
    });

    if (!workerResp.ok) {
      const errText = await workerResp.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error:
            "PDF worker error" +
            (errText ? `: ${errText.slice(0, 400)}` : ""),
        },
        { status: 500 }
      );
    }

    const buf = Buffer.from(await workerResp.arrayBuffer());

    // Upload to Vercel Blob, overwriting any prior file with same name.
    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType: "application/pdf",
      token: BLOB_TOKEN,
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
