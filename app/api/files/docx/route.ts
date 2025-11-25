// app/api/files/docx/route.ts
import { NextRequest } from "next/server";
import { createClient } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "Missing blob URL" }),
        { status: 400 }
      );
    }

    const blobClient = createClient();
    const blob = await blobClient.get(url);

    if (!blob) {
      return new Response(
        JSON.stringify({ error: "Blob not found" }),
        { status: 404 }
      );
    }

    const buf = await blob.arrayBuffer();

    return new Response(Buffer.from(buf), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="solace-export.docx"`,
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Server error" }),
      { status: 500 }
    );
  }
}

