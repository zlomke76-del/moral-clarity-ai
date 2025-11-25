// app/api/files/docx/route.ts
import { NextRequest } from "next/server";
import { get } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing blob URL" }), {
        status: 400,
      });
    }

    // Fetch blob directly
    const blob = await get(url);

    if (!blob) {
      return new Response(JSON.stringify({ error: "Blob not found" }), {
        status: 404,
      });
    }

    const buf = Buffer.from(await blob.arrayBuffer());

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="solace-export.docx"`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), {
      status: 500,
    });
  }
}
