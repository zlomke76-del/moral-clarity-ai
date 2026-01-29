// app/api/news/refresh/route.ts
// ============================================================
// NEWS REFRESH (INGEST GATE — CAPABILITY BASED)
// Canonical gatekeeper before ingest-worker execution
// ============================================================
// This route:
//  - authenticates refresh requests
//  - validates outlet acquisition CAPABILITY (not yield)
//  - blocks only on misconfiguration or missing paths
//  - invokes ingest-worker ONLY if coverage is valid
//  - DOES NOT modify ingest-worker behavior or Supabase writes
// ============================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { OUTLET_CONFIGS } from "@/lib/news/outlets";

/* ========= ENV ========= */

const NEWS_REFRESH_SECRET = process.env.NEWS_REFRESH_SECRET || "";

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

/* ========= COVERAGE AUDIT (CAPABILITY, NOT YIELD) ========= */

type CoverageReport = {
  attempted: string[];
  succeeded: string[];
  failed: { outlet: string; reason: string }[];
};

/**
 * Coverage here means:
 *  - Does this outlet have at least ONE sanctioned acquisition path?
 *  - NOT whether content appeared in the last N hours
 */
function auditOutletCoverage(): CoverageReport {
  const coverage: CoverageReport = {
    attempted: [],
    succeeded: [],
    failed: [],
  };

  for (const outlet of OUTLET_CONFIGS) {
    const canonical = outlet.canonical;
    coverage.attempted.push(canonical);

    const hasRss = Boolean(outlet.rss);
    const hasTavily = Boolean(outlet.tavilyQuery);
    const hasAnyPath = hasRss || hasTavily;

    if (!hasAnyPath) {
      coverage.failed.push({
        outlet: canonical,
        reason: "No acquisition path configured (rss or tavilyQuery missing)",
      });
      continue;
    }

    coverage.succeeded.push(canonical);
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

  // --- Coverage Gate (CAPABILITY ONLY) ---
  const coverage = auditOutletCoverage();

  if (coverage.failed.length > 0) {
    console.error("[news/refresh] coverage misconfiguration", coverage);

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
  let workerResult: any = null;

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

    workerResult = await workerResponse.json();
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

  return NextResponse.json(
    {
      ok: true,
      status: "refresh_completed",
      coverage,
      worker: workerResult,
    },
    { status: 200, headers: corsHeaders(origin) }
  );
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
