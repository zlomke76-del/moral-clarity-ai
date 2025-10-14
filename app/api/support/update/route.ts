// app/api/support/update/route.ts
import { NextResponse } from "next/server";

function assertAdmin(req: Request) {
  const hdr = req.headers.get("x-admin-key") || "";
  if (hdr !== process.env.ADMIN_DASH_KEY) throw new Error("Unauthorized");
}

export async function POST(req: Request) {
  try {
    assertAdmin(req);
    const { id, status } = await req.json(); // open | in_progress | resolved
    if (!id || !status) throw new Error("Missing id or status");

    const supa = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const r = await fetch(`${supa}/rest/v1/support_requests?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!r.ok) throw new Error(await r.text());

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message || "Bad Request", { status: e.message === "Unauthorized" ? 401 : 400 });
  }
}
