// app/api/files/docx/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing blob URL" }), {
        status: 400,
      });
    }

    // Fetch file directly (Blob SDK not required)
    const r = await fetch(url);
    if (!r.ok) {
      return new Response(JSON.stringify({ error: "Blob fetch failed" }), {
        status: 404,
      });
    }

    const buf = Buffer.from(await r.arrayBuffer());

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

