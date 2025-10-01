// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";

// You can comma-separate multiple origins in env (e.g. "https://www.moralclarityai.com,https://moralclarityai.com")
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com,https://moralclarityai.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// -------- Guidelines from env (with safe defaults) ----------
const GUIDELINE_NEUTRAL =
  process.env.GUIDELINE_NEUTRAL ||
  `Neutral mode:
- Be clear, structured, and impartial.
- Frame using recognized moral, legal, and policy frameworks.
- Identify uncertainties; avoid speculation.
- If a user shares links, summarize *those sources* first.`;

const GUIDELINE_MINISTRY =
  process.env.GUIDELINE_MINISTRY ||
  `Ministry add-on:
- Offer pastoral counsel grounded in Scripture and Christian tradition.
- Emphasize humility, human dignity, and responsibility before God.
- Be gentle, truthful, and non-partisan; cite verses appropriately.`;

const GUIDELINE_GUIDANCE =
  process.env.GUIDELINE_GUIDANCE ||
  `Guidance add-on:
- Red-team arguments for bias and failure modes.
- Provide risk registers, decision trees, and “next steps”.
- Separate facts vs. interpretations; avoid certainty inflation.`;

// -------------------------------------------------------------
function buildSystemPrompt(filters: string[], newsContext?: string) {
  const parts = [
    `You are Moral Clarity AI. Provide analysis, not endorsements of harm. 
- Anchor in truth, history, and law. 
- If a topic is sensitive, *do not* promote harmful actions; instead educate, warn, and advise responsibly.
- If you must refuse to *perform* something dangerous, still provide a neutral moral/ethical analysis of the question itself.`,
    GUIDELINE_NEUTRAL,
  ];
  if (filters?.includes("ministry")) parts.push(GUIDELINE_MINISTRY);
  if (filters?.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);

  if (newsContext) {
    parts.push(
      `News context (fresh snippets, may be incomplete):
${newsContext}

Instructions:
- Use the context above when answering.
- Keep a 1–2 sentence direct answer up top, then concise bullets.
- When you use a statement supported by a snippet, cite it with [n] where n is the source index shown in the "Sources" list.
- If something is uncertain, say so.`
    );
  } else {
    parts.push(
      `Format:
- Start with a 1–2 sentence answer.
- Then give short bullets under clear headings.
- If user provided a link, summarize that content first.`
    );
  }

  return parts.join("\n\n");
}

// -------- Rolling memory: newest 5 exchanges (10 messages) --------
const MAX_TURNS = 5;
const MAX_MESSAGES = MAX_TURNS * 2;
function trimConversation(messages: Array<{ role: string; content: string }>) {
  if (!Array.isArray(messages)) return [];
  if (messages.length <= MAX_MESSAGES) return messages;
  return messages.slice(-MAX_MESSAGES);
}

// --------- Recency detection & URL sniffing ----------
const RECENCY_REGEX =
  /\b(latest|today|tonight|this\s+(week|month|year)|breaking|right\s+now|recent|update|what\s+happened|news)\b/i;
const URL_REGEX = /(https?:\/\/[^\s]+)/i;

function looksRecent(text: string) {
  return RECENCY_REGEX.test(text);
}
function containsUrl(text: string) {
  return URL_REGEX.test(text);
}

// Make a local call to the new /api/search
async function fetchSearch(
  req: NextRequest,
  q: string,
  count = 5,
  freshness = "Week"
) {
  const base = new URL(req.url);
  base.pathname = "/api/search";
  base.search = `?q=${encodeURIComponent(q)}&count=${count}&freshness=${freshness}`;
  const resp = await fetch(base.toString(), { method: "GET" });
  if (!resp.ok) throw new Error(`search failed: ${resp.status}`);
  return resp.json();
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(allowedOrigin),
  });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
    if (ALLOWED_ORIGINS.length && !allowedOrigin) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        { status: 403, headers: corsHeaders(ALLOWED_ORIGINS[0]) }
      );
    }

    const body = await req.json();
    const { messages = [], filters = [], allowSearch = true } = body || {};
    const rolled = trimConversation(messages);
    const lastUser = [...rolled].reverse().find((m) => m.role === "user");
    const lastText = String(lastUser?.content || "");

    let sources: Array<{ index: number; title: string; url: string }> = [];
    let newsContext = "";

    // Only auto-search when:
    // 1) caller allows it
    // 2) looks like a "current event" query
    // 3) user didn't paste a link (we prefer the user's link)
    if (allowSearch && lastText && looksRecent(lastText) && !containsUrl(lastText)) {
      try {
        const search = await fetchSearch(req, lastText, 4, "Week"); // 4 good snippets
        const results = Array.isArray(search?.results) ? search.results : [];
        if (results.length) {
          newsContext = results
            .map(
              (r: any, i: number) =>
                `[${i + 1}] ${r.title} — ${r.snippet} (${r.url})`
            )
            .join("\n");
          sources = results.map((r: any, i: number) => ({
            index: i + 1,
            title: r.title,
            url: r.url,
          }));
        }
      } catch {
        // Swallow search errors silently; we still answer neutrally.
      }
    }

    const system = buildSystemPrompt(filters, newsContext);

    const response = await client.responses.create({
      model: MODEL,
      input: [
        { role: "system", content: system },
        ...rolled.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || ""),
        })),
      ],
      max_output_tokens: 900,
      temperature: 0.4,
    });

    // Try multiple extraction paths for Responses API
    let text =
      (response as any).output_text ??
      (response as any).content?.[0]?.text ??
      (Array.isArray((response as any).content)
        ? (response as any).content.map((c: any) => c?.text).filter(Boolean).join("\n\n")
        : "");

    if (!text || !text.trim()) {
      text = "[No content returned by model]";
    }

    return NextResponse.json(
      { text, model: MODEL, sources },
      { headers: { ...corsHeaders(allowedOrigin || ALLOWED_ORIGINS[0]), "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    // Surface meaningful error back to the client
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Unknown error";
    return NextResponse.json(
      { error: msg },
      {
        status: 500,
        headers: { ...corsHeaders(ALLOWED_ORIGINS[0]), "Content-Type": "application/json" },
      }
    );
  }
}
