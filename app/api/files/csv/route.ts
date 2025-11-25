// app/api/files/csv/route.ts
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "Missing blob URL" }), {
        status: 400,
      });
    }

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
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="solace-export.csv"`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), {
      status: 500,
    });
  }
}
