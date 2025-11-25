// app/api/files/docx/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const title = (body?.title as string) || "Solace DOCX";
    const text = (body?.content as string) || "";

    const filename = slugFromText(title, "docx");

    // Call Python worker to generate DOCX binary
    const workerUrl = process.env.PY_WORKER_URL;
    const workerKey = process.env.PY_WORKER_KEY;

    if (!workerUrl || !workerKey) {
      return NextResponse.json(
        { ok: false, message: "Export worker not configured." },
        { status: 500 }
      );
    }

    const pyRes = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${workerKey}`,
      },
      body: JSON.stringify({
        type: "docx",
        title,
        content: text,
      }),
    });

    if (!pyRes.ok) {
      const detail = await pyRes.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          message: "DOCX worker error",
          detail,
        },
        { status: 500 }
      );
    }

    const buf = Buffer.from(await pyRes.arrayBuffer());

    // Upload to Blob – allow overwrite so we don't fail on same filename
    const blob = await put(`exports/${filename}`, buf, {
      access: "public",
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // if file already exists, just overwrite it
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
      { ok: false, message: "DOCX export failed", error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
