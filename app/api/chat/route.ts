// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-5-nano";

// CORS
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://www.moralclarityai.com";

// ----- Guideline “warehouse” (env-first with safe defaults) -----
const GUIDELINE_NEUTRAL =
  process.env.GUIDELINE_NEUTRAL ||
  `Neutral mode:
- Be clear, structured, and impartial.
- Frame issues using recognized frameworks (e.g., utilitarianism, deontology, law, Just War).
- Identify uncertainties and avoid speculation.
- Cite sources when the user gives links; otherwise state that you do not have live browsing.`;

const GUIDELINE_MINISTRY =
  process.env.GUIDELINE_MINISTRY ||
  `Ministry add-on:
- Offer pastoral, Biblical counsel with humility and care.
- Anchor moral reasoning in Scripture, Christian tradition, and stewardship before God.
- Emphasize human responsibility for life-and-death judgments.
- Be gentle, truthful, and non-political; cite verses appropriately.`;

const GUIDELINE_GUIDANCE =
  process.env.GUIDELINE_GUIDANCE ||
  `Guidance add-on (red-team & clarity):
- Pressure-test arguments for bias, incentives, and failure modes.
- Offer risk registers, decision trees, and “next-step” checklists.
- Surface what would change your conclusion (“decision pivots”).
- Split facts vs. interpretations; avoid certainty inflation.`;

// ----- Build the system prompt from selected filters -----
function buildSystemPrompt(filters: string[]) {
  const parts = [GUIDELINE_NEUTRAL];

  if (filters?.includes("ministry")) parts.push(GUIDELINE_MINISTRY);
  if (filters?.includes("guidance")) parts.push(GUIDELINE_GUIDANCE);

  // subtle reminder to keep responses concise and structured
  parts.push(
    `Format:
- Start with a 1–2 sentence answer.
- Then provide short, skimmable bullets under clear headings.
- If user provided a link, summarize *that content* first.`
  );

  return parts.join("\n\n");
}

// Trim to newest N user↔AI exchanges (N=5 => 10 messages)
const MAX_TURNS = 5;
const MAX_MESSAGES = MAX_TURNS * 2;

function trimConversation(messages: Array<{ role: string; content: string }>) {
  if (!Array.isArray(messages)) return [];
  if (messages.length <= MAX_MESSAGES) return messages;
  return messages.slice(-MAX_MESSAGES);
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
    const origin = req.headers.get("origin") || "";
    if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: "Origin not allowed" },
        {
          status: 403,
          headers: {
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          },
        }
      );
    }

    const body = await req.json();
    const { messages = [], filters = [] } = body || {};
    const rolled = trimConversation(messages);

    const system = buildSystemPrompt(filters);

    const response = await client.responses.create({
      model: MODEL,
      // Responses API accepts "input" or "messages"; we’ll use "input" with role blocks
      input: [
        { role: "system", content: system },
        ...rolled.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || ""),
        })),
      ],
      // keep it crisp
      max_output_tokens: 800,
      temperature: 0.4,
    });

    const text =
      (response as any).output_text ||
      (response as any).content?.[0]?.text ||
      JSON.stringify(response);

    return NextResponse.json(
      { text, model: MODEL, turns_kept: MAX_TURNS },
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
