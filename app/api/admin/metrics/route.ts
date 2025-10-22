// app/api/admin/metrics/route.ts
import { NextResponse } from "next/server";

/** Simple header check; throws on failure */
function assertAdmin(req: Request) {
  const hdr = req.headers.get("x-admin-key") || "";
  if (hdr !== process.env.ADMIN_DASH_KEY) throw new Error("Unauthorized");
}

/** Count rows by status via Supabase REST with Prefer: count=exact */
async function countByStatus(
  supaUrl: string,
  headers: Record<string, string>,
  status: string
) {
  const url = new URL(`${supaUrl}/rest/v1/support_requests`);
  url.searchParams.set("select", "id");
  url.searchParams.set("status", `eq.${status}`);
  const r = await fetch(url.toString(), {
    headers: { ...headers, Prefer: "count=exact" },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(await r.text());
  // Content-Range: */<total>
  return Number(r.headers.get("content-range")?.split("/")[1] || "0");
}

export async function GET(req: Request) {
  try {
    assertAdmin(req);

    const SUPA = process.env.SUPABASE_URL!;
    const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

    // ---- counts -----------------------------------------------------------
    const [open, inprog, resolved] = await Promise.all([
      countByStatus(SUPA, headers, "open"),
      countByStatus(SUPA, headers, "in_progress"),
      countByStatus(SUPA, headers, "resolved"),
    ]);

    // last 7 days created
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentUrl = new URL(`${SUPA}/rest/v1/support_requests`);
    recentUrl.searchParams.set("select", "id");
    recentUrl.searchParams.set("created_at", `gte.${since}`);
    const recentRes = await fetch(recentUrl.toString(), {
      headers: { ...headers, Prefer: "count=exact" },
      cache: "no-store",
    });
    if (!recentRes.ok) throw new Error(await recentRes.text());
    const last7 = Number(recentRes.headers.get("content-range")?.split("/")[1] || "0");

    // latest 10 tickets
    const listUrl = new URL(`${SUPA}/rest/v1/support_requests`);
    listUrl.searchParams.set(
      "select",
      "id,name,email,category,status,created_at,description"
    );
    listUrl.searchParams.set("order", "created_at.desc");
    listUrl.searchParams.set("limit", "10");
    const latestRes = await fetch(listUrl.toString(), {
      headers,
      cache: "no-store",
    });
    if (!latestRes.ok) throw new Error(await latestRes.text());
    const latest = await latestRes.json();

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      support: { open, in_progress: inprog, resolved, last7, latest },
      env: {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        SUPPORT_INBOX: !!process.env.SUPPORT_INBOX,
        APP_BASE_URL: !!process.env.APP_BASE_URL,
      },
    });
  } catch (e: any) {
    const code = e?.message === "Unauthorized" ? 401 : 400;
    return new NextResponse(e?.message || "Bad Request", { status: code });
  }
}
