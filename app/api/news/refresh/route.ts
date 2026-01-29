// app/api/news/refresh/route.ts
// ============================================================
// NEWS REFRESH (INGEST GATE)
// Canonical gatekeeper before ingest-worker execution
// ============================================================
// This route:
//  - authenticates refresh requests
//  - performs a full outlet coverage audit (read-only)
//  - enforces multi-path reachability (RSS → Tavily → Browserless)
//  - invokes ingest-worker ONLY if coverage is complete
//  - DOES NOT modify ingest-worker behavior or Supabase writes
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import { OUTLET_CONFIGS } from "@/lib/news/outlets";
import { fetchRssItems, filterItemsByDays } from "@/lib/news/rss";
import { webSearch } from "@/lib/search";

/* ========= ENV ========= */

const NEWS_REFRESH_SECRET = process.env.NEWS_REFRESH_SECRET || "";
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN || "";

// 🔒 Canonical production ingest worker endpoint
const INGEST_WORKER_URL =
  "https://studio.moralclarity.ai/api/news/ingest-worker";

/* ========= CORS ========= */

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  h.set("Access-Control-Max-Age", "86400");
  if (origin) h.set("Access-Control-Allow-Origin", origin);
  return h;
}

function pickOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;

  try {
    const u = new URL(origin);
    if (
      u.hostname.endsWith("moralclarity.ai") ||
      u.hostname.endsWith("moralclarityai.com") ||
      u.hostname === "localhost"
    ) {
      return origin;
    }
  } catch {}

  return null;
}

/* ========= BROWSERLESS PROBE (READ-ONLY) ========= */

async function probeWithBrowserless(url: string): Promise<boolean> {
  if (!BROWSERLESS_TOKEN) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(
      `https://chrome.browserless.io/content?token=${encodeURIComponent(
        BROWSERLESS_TOKEN
      )}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          options: {
            waitUntil: "domcontentloaded",
            timeout: 7000,
          },
        }),
      }
    );

    clearTimeout(timeout);

    if (!resp.ok) return false;

    const text = await resp.text();
    return typeof text === "string" && text.length > 500;
  } catch {
    return false;
  }
}

/* ========= COVERAGE AUDIT (READ-ONLY, MULTI-PATH) ========= */

type CoverageReport = {
  attempted: string[];
  succeeded: string[];
  noContent: string[];
  failed: { outlet: string; reason: string }[];
};

async function auditOutletCoverage(): Promise<CoverageReport> {
  const coverage: CoverageReport = {
    attempted: [],
    succeeded: [],
    noContent: [],
    failed: [],
  };

  for (const outlet of OUTLET_CONFIGS) {
    const canonical = outlet.canonical;
    coverage.attempted.push(canonical);

    let reachable = false;
    let hadContent = false;

    // ---- 1) RSS ----
    if (outlet.rss) {
      try {
        const items = await fetchRssItems(outlet.rss);
        const recent = filterItemsByDays(items, 2);
        if (recent.length > 0) {
          reachable = true;
          hadContent = true;
        }
      } catch {
        // fall through
      }
    }

    // ---- 2) TAVILY ----
    if (!reachable) {
      try {
        const results = await webSearch(
          outlet.tavilyQuery || `site:${canonical}`,
          { news: true, max: 1, days: 2 }
        );
        if (Array.isArray(results) && results.length > 0) {
          reachable = true;
          hadContent = true;
        }
      } catch {
        // fall through
      }
    }

    // ---- 3) BROWSERLESS (REACHABILITY ONLY) ----
    if (!reachable) {
      const probeUrl = `https://${canonical}`;
      const ok = await probeWithBrowserless(probeUrl);
      if (ok) {
        reachable = true;
        hadContent = false; // reachable but quiet
      }
    }

    if (reachable) {
      if (hadContent) {
        coverage.succeeded.push(canonical);
      } else {
        coverage.noContent.push(canonical);
      }
    } else {
      coverage.failed.push({
        outlet: canonical,
        reason: "Unreachable via RSS, Tavily, and Browserless",
      });
    }
  }

  return coverage;
}

/* ========= MAIN ========= */

async function handleRefresh(req: NextRequest) {
  const origin = pickOrigin(req);

  // --- Auth ---
  if (NEWS_REFRESH_SECRET) {
    const url = new URL(req.url);
    const token =
      url.searchParams.get("secret") || req.headers.get("x-news-secret");

    if (token !== NEWS_REFRESH_SECRET) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401, headers: corsHeaders(origin) }
      );
    }
  }

  // --- Coverage Gate ---
  let coverage: CoverageReport;
  try {
    coverage = await auditOutletCoverage();
  } catch (err: any) {
    console.error("[news/refresh] coverage audit failed", err);
    return NextResponse.json(
      {
        ok: false,
        status: "coverage_audit_failed",
        message: err?.message || String(err),
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }

  if (coverage.failed.length > 0) {
    console.error("[news/refresh] coverage incomplete", coverage);
    return NextResponse.json(
      {
        ok: false,
        status: "coverage_incomplete",
        coverage,
      },
      { status: 503, headers: corsHeaders(origin) }
    );
  }

  // --- Ingest Worker Invocation (UNCHANGED) ---
  try {
    const workerResponse = await fetch(INGEST_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(NEWS_REFRESH_SECRET
          ? { "x-news-secret": NEWS_REFRESH_SECRET }
          : {}),
      },
    });

    if (!workerResponse.ok) {
      const text = await workerResponse.text();
      throw new Error(
        `Ingest worker failed (${workerResponse.status}): ${text}`
      );
    }

    const worker = await workerResponse.json();

    return NextResponse.json(
      {
        ok: true,
        status: "refresh_completed",
        coverage,
        worker,
      },
      { status: 200, headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error("[news/refresh] ingest-worker invocation failed", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Ingest worker invocation failed",
        message: err?.message || String(err),
      },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleRefresh(req);
}

export async function POST(req: NextRequest) {
  return handleRefresh(req);
}

export async function OPTIONS(req: NextRequest) {
  const origin = pickOrigin(req);
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
