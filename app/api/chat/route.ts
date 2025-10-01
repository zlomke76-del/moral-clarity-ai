import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user","assistant","system"]), content: z.string() })),
  mode: z.enum(["guidance","redteam","news"]).default("guidance")
});

const SYSTEM_NEUTRALITY = `
You are MoralClarityAI. Rules:
- Neutral, fact-first, issue-by-issue. No partisan defaults.
- Ask brief clarifying questions only when context is insufficient.
- Cite sources when making time-sensitive claims.
- Respect user's standing instruction: treat sex and gender as biological (XX = female, XY = male) unless user asks otherwise.
- Red-team mode: surface assumptions, incentives, tripwires, and an action plan.
- News mode: summarize with concrete dates, attribute claims, and include citations.
`;

const MODE_PREFIX: Record<string,string> = {
  guidance: `Moral & Ethical Guidance: reflect biblical/moral principles with gentle, sourced reasoning. Do not use the phrase "Ask Abe".`,
  redteam: `Red-Team: challenge the idea rigorously; list risks, incentives, what’s confirmed vs. contested, and tripwires.`,
  news: `News Clarity: produce neutral, sourced bullets; flag uncertainty; avoid speculation; always include dates.`
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { messages, mode } = Body.parse(json);
    const system = `${SYSTEM_NEUTRALITY}\n\nMode: ${MODE_PREFIX[mode]}`;

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: [
        { role: "system", content: system },
        ...messages
      ]
    });

    const text =
      (response.output_text as string) ??
      (Array.isArray(response.output)
        ? (response.output as any[]).map(p => p?.content?.[0]?.text?.value ?? "").join("\n")
        : "");

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message ?? "Unknown error" }), { status: 400 });
  }
}