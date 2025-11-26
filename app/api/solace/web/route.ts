// app/api/solace/web/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import { webSearch } from "@/lib/search";
import { buildInternetSystemPrompt } from "@/lib/solace/internet-mode";
import { SolaceEngine } from "@/lib/solace-engine/engine";
import type { SolaceDomain } from "@/lib/solace/persona";

/* -------------------------------------------------------
   ORIGINS / CORS  (mirrors /api/chat)
-------------------------------------------------------- */

const STATIC_ALLOWED_ORIGINS = [
  "https://moralclarity.ai",
  "https://www.moralclarity.ai",
  "https://studio.moralclarity.ai",
  "https://studio-founder.moralclarity.ai",
  "https://moralclarityai.com",
  "https://www.moralclarityai.com",
  "http://localhost:3000",
];

const ENV_ALLOWED_ORIGINS = (process.env.MCAI_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_SET = new Set<string>([
  ...STATIC_ALLOWED_ORIGINS,
  ...ENV_ALLOWED_ORIGINS,
]);

function hostIsAllowedWildcard(hostname: string) {
  return (
    /^([a-z0-9-]+\.)*moralclarity\.ai$/i.test(hostname) ||
    /^([a-z0-9-]+\.)*moralclarityai\.com$/i.test(hostname)
  );
}

function pickAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try {
    if (ALLOWED_SET.has(origin)) return origin;
    const url = new URL(origin);
    if (hostIsAllowedWildcard(url.hostname)) return origin;
  } catch {
    // ignore
  }
  return null;
}

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  h.set("Vary", "Origin");
  h.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  h.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-Context-Id"
  );
  h.set("Access-Control-Max-Age", "86400");
  if (origin) h.set("Access-Control-Allow-Origin", origin);
  return h;
}

function headersToRecord(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k] = v));
  return out;
}

/* -------------------------------------------------------
   TYPES
-------------------------------------------------------- */

type WebMessage = { role: "user" | "assistant"; content: string };

type WebBody = {
  query?: string;
  messages?: WebMessage[];
  maxResults?: number;
  depth?: "basic" | "advanced";
};

/* -------------------------------------------------------
   HEALTHCHECK
-------------------------------------------------------- */

export async function GET(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));
  return NextResponse.json(
    {
      ok: true,
      route: "/api/solace/web",
      tavilyEnabled: Boolean(
        process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY
      ),
    },
    { headers: corsHeaders(origin) }
  );
}

/* -------------------------------------------------------
   OPTIONS (CORS preflight)
-------------------------------------------------------- */

export async function OPTIONS(req: NextRequest) {
  const origin = pickAllowedOrigin(req.headers.get("origin"));
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

/* -------------------------------------------------------
   POST — Internet evaluation using Tavily + Solace
-------------------------------------------------------- */

export async function POST(req: NextRequest) {
  const reqOrigin = req.headers.get("origin");
  const echoOrigin = pickAllowedOrigin(reqOrigin);
  const sameOrNoOrigin = !reqOrigin;

  if (!echoOrigin && !sameOrNoOrigin) {
    return NextResponse.json(
      { error: "Origin not allowed", allowed: Array.from(ALLOWED_SET) },
      { status: 403, headers: corsHeaders(null) }
    );
  }

  try {
    const body = (await req.json().catch(() => ({}))) as WebBody;

    const query = String(body.query || "").trim();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!query) {
      return NextResponse.json(
        { error: "Missing query" },
        { status: 400, headers: corsHeaders(echoOrigin) }
      );
    }

    const maxResults =
      typeof body.maxResults === "number" && body.maxResults > 0
        ? Math.min(body.maxResults, 10)
        : 6;

    const depthFlag =
      body.depth === "advanced" ? "advanced" : ("basic" as "basic" | "advanced");

    // ---- Tavily search ----
    const results = await webSearch(query, {
      max: maxResults,
      // For now we treat this as generic web search, not news-only.
      // If you want a dedicated news internet route, we can split later.
    });

    // Compact SEARCH_RESULTS wrapper for the system prompt.
    const searchPayload = {
      query,
      depth: depthFlag,
      items: results,
      generated_at: new Date().toISOString(),
    };

    const searchJson = JSON.stringify(searchPayload, null, 2);

    // ---- Build Solace system prompt for Internet mode ----
    const extras = `
SEARCH_RESULTS (JSON):

"""json
${searchJson}
"""

You are helping the user understand or evaluate the information above.

- Treat SEARCH_RESULTS as your factual window into the web for this request.
- You MUST NOT say "I can't browse the internet" or similar, because you have this snapshot.
- Anchor your answer in concrete details from SEARCH_RESULTS (titles, snippets, domains, dates).
- If results conflict, call out the conflict and explain how you'd interpret it.
- If the results are thin or noisy, say so and explain limits on confidence.
`.trim();

    const system = buildInternetSystemPrompt(extras);

    const rolledMessages: WebMessage[] = [
      ...messages,
      { role: "user", content: query },
    ];

    // ---- Call Solace engine (non-stream) ----
    const text = (await SolaceEngine.generate({
      payload: {
        mode: "Guidance",
        system,
        messages: rolledMessages,
        temperature: 0.2,
        max_output_tokens: 900,
        context: {
          research: extras,
          news: null,
          memory: null,
        },
        context_mode: "authoritative",
      },
      stream: false,
      isFounder: false,
      fallback: true,
      max_output_tokens: 900,
      timeoutMs: 40_000,
    })) as string;

    return NextResponse.json(
      {
        text,
        search_results: searchPayload,
        model: "internet-solace",
      },
      { headers: corsHeaders(echoOrigin) }
    );
  } catch (err: any) {
    const echoOrigin = pickAllowedOrigin(req.headers.get("origin"));
    const msg = err?.message || String(err);
    return NextResponse.json(
      { error: msg },
      { status: 500, headers: corsHeaders(echoOrigin) }
    );
  }
}
