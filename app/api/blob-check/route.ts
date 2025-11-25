// app/api/blob-check/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs"; // blob requires node runtime

export async function GET() {
  try {
    // minimal, cheap write to confirm the client works
    const { url } = await put("mca-blob-check.txt", "ok", {
      access: "public",
    });

    return NextResponse.json({
      ok: true,
      message: "Blob is installed and working.",
      url,
    });
  } catch (err: any) {
    console.error("Blob check error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Blob check failed.",
        error: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}
