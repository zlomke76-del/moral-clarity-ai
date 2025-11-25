// app/api/files/pdf/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { slugFromText } from "@/lib/files/slug";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const title = (body?.title as string) || "Solace PDF";
    const text = (body?.content as string) || "";

    const filename = slugFromText(title, "pdf");

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
        type: "pdf",
        title,
        content: text,
      }),
    });

    if (!pyRes.ok) {
      const detail = await pyRes.text().catch(() => "");
      return NextResponse.json(
        { ok: false, message: "PDF worker error", detail },
        { status: 500 }
      );
    }

    const buf = Buffer.from(await pyRes.arrayBuffer());

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
      { ok: false, message: "PDF export failed", error: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
