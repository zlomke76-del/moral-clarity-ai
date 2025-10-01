// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

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
- If a topic is sensitive, do not promote harmful action; educate, warn, and advise responsibly.`,
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
- If the user provided a link, summarize that content first.`
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
  freshness: "Day" | "Week" | "Month" = "Week"
) {
  const base = new URL(req.url);
  base.pathname = "/api/search";
  base.search = `?q=${encodeURIComponent(q)}&count=${count}&freshness=${freshness}`;
  const resp = await fetch(base.toString(), { method: "GET" });
  if (!resp.ok) throw new Error(`search failed: ${resp.status}`);
  return resp.json();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Basic CORS
    const origin = req.headers.get("origin") || "";
    if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        {
          status: 403,
          headers: { "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
        }
      );
    }

    const body = await req.json();
    const {
      messages = [],
      filters = [],
      allowSearch = true,
    }: {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      filters: string[];
      allowSearch?: boolean;
    } = body || {};

    // Rolling memory
    const rolled = trimConversation(messages);
    const lastUser = [...rolled].reverse().find((m) => m.role === "user");
    const lastText = String(lastUser?.content || "");

    let sources: Array<{ index: number; title: string; url: string }> = [];
    let newsContext = "";

    if (allowSearch && lastText && looksRecent(lastText) && !containsUrl(lastText)) {
      try {
        const search = await fetchSearch(req, lastText, 4, "Week");
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
        // swallow silently
      }
    }

    const system = buildSystemPrompt(filters, newsContext);

    // Build Chat Completions API messages
    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: system },
      ...rolled.map((m) =>
        m.role === "assistant"
          ? ({ role: "assistant", content: String(m.content ?? "") } as const)
          : ({ role: "user", content: String(m.content ?? "") } as const)
      ),
    ];

    // Build payload WITHOUT temperature (models like gpt-5-nano only support default=1)
    const payload: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: MODEL,
      messages: apiMessages,
      max_completion_tokens: 900,
    };

    // Optional: allow forcing a temperature via env for models that support it.
    // e.g., set FORCE_TEMPERATURE=0.4 for gpt-4o, gpt-4.1, etc.
    if (process.env.FORCE_TEMPERATURE && process.env.FORCE_TEMPERATURE !== "default") {
      const t = Number(process.env.FORCE_TEMPERATURE);
      if (!Number.isNaN(t)) {
        // NOTE: if the model doesn't support custom temp, the API will ignore or error.
        payload.temperature = t;
      }
    }

    const completion = await client.chat.completions.create(payload);

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "[No content returned by model]";

    return NextResponse.json(
      { text, model: MODEL, sources },
      {
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Content-Type": "application/json",
        },
      }
    );
  }
}
