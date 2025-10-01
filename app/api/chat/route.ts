import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Allow your web origin
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "https://www.moralclarityai.com";
const CORS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const Body = z.object({
  messages: z.array(z.object({
    role: z.enum(["user","assistant","system"]),
    content: z.string()
  })),
  mode: z.enum(["guidance","redteam","news"]).default("guidance"),
});

const SYSTEM = `You are MoralClarityAI. Neutral, sourced, and precise. Respect the "no Ask Abe" rule.`;

export function OPTIONS() {
  return new Response(null, { headers: CORS });
}

export async function POST(req: Request) {
  try {
    const { messages, mode } = Body.parse(await req.json());

    const modePrefix = mode === "redteam"
      ? "Red-team this: surface risks, incentives, and tripwires."
      : mode === "news"
      ? "News clarity: neutral summary with dates and citations."
      : "Guidance: moral clarity with gentle reasoning and optional citations.";

    const response = await client.responses.create({
      model: "gpt-5.1",
      input: [
        { role: "system", content: `${SYSTEM}\nMode: ${modePrefix}` },
        ...messages
      ],
    });

    const text =
      (response as any).output_text ??
      (Array.isArray((response as any).output)
        ? ((response as any).output as any[])
            .map(p => p?.content?.[0]?.text?.value ?? "")
            .join("\n")
        : "");

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json", ...CORS },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? "Unknown error" }), {
      headers: { "Content-Type": "application/json", ...CORS },
      status: 400,
    });
  }
}
