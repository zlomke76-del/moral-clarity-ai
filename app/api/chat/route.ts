// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

// Use Bing Web Search by default.
// Create a free/paid key at https://www.microsoft.com/bing/apis
const BING_KEY = process.env.BING_SEARCH_KEY || "";
const BING_ENDPOINT =
  process.env.BING_SEARCH_ENDPOINT ||
  "https://api.bing.microsoft.com/v7.0/search";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

async function doSearch(query: string, count = 5, freshness?: string) {
  if (!BING_KEY) {
    return {
      results: [],
      warning:
        "BING_SEARCH_KEY is not set. Add it in Vercel env vars to enable live search.",
    };
  }
  const params = new URLSearchParams({
    q: query,
    mkt: "en-US",
    count: String(count),
    textDecorations: "false",
    safeSearch: "Moderate",
  });
  if (freshness) params.set("freshness", freshness); // e.g. Day, Week, Month

  const r = await fetch(`${BING_ENDPOINT}?${params.toString()}`, {
    headers: { "Ocp-Apim-Subscription-Key": BING_KEY },
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error(`Bing search failed: HTTP ${r.status} ${text}`);
  }
  const data = await r.json();
  const items =
    data?.webPages?.value?.map((v: any) => ({
      title: v.name,
      url: v.url,
      snippet: v.snippet,
      displayUrl: v.displayUrl,
      source: new URL(v.url).hostname.replace(/^www\./, ""),
    })) || [];
  return { results: items.slice(0, count) };
}

export async function GET(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    if (origin && ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403, headers: corsHeaders() }
      );
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const count = Number(searchParams.get("count") || 5);
    const freshness = searchParams.get("freshness") || undefined;

    if (!q.trim()) {
      return NextResponse.json(
        { results: [], warning: "Empty query" },
        { headers: corsHeaders() }
      );
    }
    const out = await doSearch(q, count, freshness);
    return NextResponse.json(out, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Search error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    if (origin && ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403, headers: corsHeaders() }
      );
    }

    const body = await req.json();
    const q = String(body?.q || "");
    const count = Number(body?.count || 5);
    const freshness = body?.freshness || undefined;

    if (!q.trim()) {
      return NextResponse.json(
        { results: [], warning: "Empty query" },
        { headers: corsHeaders() }
      );
    }
    const out = await doSearch(q, count, freshness);
    return NextResponse.json(out, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Search error" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
