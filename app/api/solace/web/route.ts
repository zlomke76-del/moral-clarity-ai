// app/api/solace/web/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

import { webSearch } from "@/lib/search";
import { buildInternetSystemPrompt } from "@/lib/solace/internet-mode";
import { SolaceEngine } from "@/lib/solace-engine/engine";

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

/* -------------------------------------------------------
   TYPES
-------------------------------------------------------- */

type WebMessage = { role: "user" | "assistant"; content: string };

type WebBody = {
  query?: string;
  messages?: WebMessage[];
  maxResults?: number;
  depth?: "basic" | "advanced";
  /**
   * Optional mode hint:
   *  - "auto"    => infer from query (default)
   *  - "website" => treat as website review (URL/domain-centric)
   *  - "search"  => treat as generic web search
   */
  mode?: "auto" | "website" | "search";
};

type GenericSearchPayload = {
  kind: "search";
  query: string;
  depth: "basic" | "advanced";
  items: any[];
  generated_at: string;
};

type WebsitePageSnapshot = {
  url: string;
  title: string | null;
  snippet: string | null;
};

type WebsiteSnapshotPayload = {
  kind: "website";
  query: string;
  domain: string;
  depth: "basic" | "advanced";
  pages: WebsitePageSnapshot[];
  generated_at: string;
};

/* -------------------------------------------------------
   HELPERS
-------------------------------------------------------- */

function headersToRecord(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => (out[k] = v));
  return out;
}

function looksLikeUrlOrDomain(query: string): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return false;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return true;
  }
  // crude but safe domain heuristic
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmed);
}

function normalizeDomain(input: string): string | null {
  try {
    let url = input.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    const u = new URL(url);
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

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

    const depthFlag: "basic" | "advanced" =
      body.depth === "advanced" ? "advanced" : "basic";

    const modeHint = body.mode || "auto";

    // Decide mode: website-centric vs generic search
    const websiteMode =
      modeHint === "website" ||
      (modeHint === "auto" && looksLikeUrlOrDomain(query));

    // ---- Tavily search ----
    const results = await webSearch(query, {
      max: maxResults,
    });

    let extras: string;
    let researchPayload: GenericSearchPayload | WebsiteSnapshotPayload;

    if (websiteMode) {
      // WEBSITE SNAPSHOT MODE — depth-1 multi-page, domain-filtered
      const domain = normalizeDomain(query);
      const now = new Date().toISOString();

      const pages: WebsitePageSnapshot[] = [];

      if (Array.isArray(results)) {
        for (const item of results) {
          const url = typeof item?.url === "string" ? item.url : null;
          if (!url) continue;

          if (domain) {
            try {
              const u = new URL(url);
              if (u.hostname.toLowerCase() !== domain) {
                continue;
              }
            } catch {
              continue;
            }
          }

          const title =
            typeof item?.title === "string" && item.title.trim()
              ? item.title.trim()
              : null;

          const snippetSource =
            (typeof item?.content === "string" && item.content.trim()) ||
            (typeof item?.snippet === "string" && item.snippet.trim()) ||
            "";

          const snippet =
            snippetSource.length > 600
              ? snippetSource.slice(0, 600) + "…"
              : snippetSource || null;

          pages.push({
            url,
            title,
            snippet,
          });
        }
      }

      researchPayload = {
        kind: "website",
        query,
        domain: domain || "unknown",
        depth: depthFlag,
        pages,
        generated_at: now,
      };

      const websiteJson = JSON.stringify(researchPayload, null, 2);

      extras = `
WEBSITE_SNAPSHOT (JSON):

"""json
${websiteJson}
"""

You are evaluating a website based on this multi-page snapshot.

- Treat WEBSITE_SNAPSHOT as your ONLY window into the site for this request.
- DO NOT assume any pages, content, CTAs, or elements exist if they are not
  visible in WEBSITE_SNAPSHOT.pages.
- You MUST NOT say "I can't browse the internet" or similar, because you have
  this snapshot.
- Before analyzing, briefly list what is actually visible:
  • Which URLs you see.
  • For each page: title (if any) and a short snippet summary based only on
    the snippet text provided.

Then:
- If the user is asking for an assessment/review/audit of the site, you MUST
  follow the WEBSITE SNAPSHOT REVIEW PROTOCOL from your system prompt.
- In every section of that protocol, you MUST ground your comments in concrete
  details from WEBSITE_SNAPSHOT.pages.
- When something would normally matter (e.g. testimonials, privacy policy,
  team bios) but is NOT visible in the snapshot, you MUST say:
    "Not visible in this snapshot."
- You are allowed to interpret, compare to norms, and suggest improvements,
  but you are NOT allowed to state that a specific element exists if it is
  not visible in the snapshot.
`.trim();
    } else {
      // GENERIC SEARCH MODE
      const searchPayload: GenericSearchPayload = {
        kind: "search",
        query,
        depth: depthFlag,
        items: results,
        generated_at: new Date().toISOString(),
      };

      researchPayload = searchPayload;

      const searchJson = JSON.stringify(searchPayload, null, 2);

      extras = `
SEARCH_RESULTS (JSON):

"""json
${searchJson}
"""

You are helping the user understand or evaluate the information above.

- Treat SEARCH_RESULTS as your factual window into the web for this request.
- You MUST NOT say "I can't browse the internet" or similar, because you have
  this snapshot.
- Anchor your answer in concrete details from SEARCH_RESULTS (titles, snippets,
  domains, dates).
- If results conflict, call out the conflict and explain how you'd interpret it.
- If the results are thin or noisy, say so and explain limits on confidence.
`.trim();
    }

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
        research: researchPayload,
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

