// app/api/files/docx/route.ts
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
    const title = (body?.title as string) || "Solace Document";
    const text = (body?.content as string) || "";

    if (!text.trim()) {
      return NextResponse.json(
        { ok: false, error: "No content provided to export." },
        { status: 400 }
      );
    }

    const filename = slugFromText(title, "docx");

    // Call Python worker to generate DOCX binary
    const workerResp = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WORKER_KEY}`,
      },
      body: JSON.stringify({
        type: "docx",
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
            "DOCX worker error" +
            (errText ? `: ${errText.slice(0, 400)}` : ""),
        },
        { status: 500 }
      );
    }

    const buf = Buffer.from(await workerResp.arrayBuffer());

    // Upload to Vercel Blob, overwriting any prior file with same name.
    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      token: BLOB_TOKEN,
      allowOverwrite: true,
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
