// app/api/admin/metrics/route.ts
import { NextResponse } from "next/server";

function assertAdmin(req: Request) {
  const hdr = req.headers.get("x-admin-key") || "";
  if (hdr !== process.env.ADMIN_DASH_KEY) throw new Error("Unauthorized");
}

export async function GET(req: Request) {
  try {
    assertAdmin(req);

    const SUPA = process.env.SUPABASE_URL!;
    const KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

    // Counts by status
    async function countByStatus(status: string) {
      const url = new URL(`${SUPA}/rest/v1/support_requests`);
      url.searchParams.set("select", "id");
      url.searchParams.set("status", `eq.${status}`);
      url.searchParams.set("limit", "1");
      url.searchParams.set("head", "true");
      const r = await fetch(url, { headers, method: "GET" });
      if (!r.ok) throw new Error(await r.text());
      // Supabase returns count via content-range header when 'prefer' is set; but REST head=count can vary.
      // Simpler: do a count endpoint using rpc or select=count: exact
      const r2 = await fetch(`${SUPA}/rest/v1/support_requests?status=eq.${status}&select=id&count=exact`, { headers });
      if (!r2.ok) throw new Error(await r2.text());
      return Number(r2.headers.get("content-range")?.split("/")[1] || "0");
    }

    const [open, inprog, resolved] = await Promise.all([
      countByStatus("open"),
      countByStatus("in_progress"),
      countByStatus("resolved"),
    ]);

    // Last 7 days total
    const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();
    const recentUrl = new URL(`${SUPA}/rest/v1/support_requests`);
    recentUrl.searchParams.set("created_at", `gte.${since}`);
    recentUrl.searchParams.set("select", "id");
    recentUrl.searchParams.set("count", "exact");
    const recentRes = await fetch(recentUrl, { headers });
    if (!recentRes.ok) throw new Error(await recentRes.text());
    const last7 = Number(recentRes.headers.get("content-range")?.split("/")[1] || "0");

    // Latest 10 tickets
    const listUrl = new URL(`${SUPA}/rest/v1/support_requests`);
    listUrl.searchParams.set("select", "id,name,email,category,status,created_at,description");
    listUrl.searchParams.set("order", "created_at.desc");
    listUrl.searchParams.set("limit", "10");
    const latestRes = await fetch(listUrl, { headers, cache: "no-store" });
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
    return new NextResponse(e.message || "Bad Request", { status: e.message === "Unauthorized" ? 401 : 400 });
  }
}
