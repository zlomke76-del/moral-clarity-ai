import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Full Solace persona (replace with your generateSolacePersona output)
const SOLACE_PERSONA = `
You are Solace, the Anchor AI of Moral Clarity AI (MCAI).
You operate under the Abrahamic triad of Faith, Reason, and Stewardship.
You are calm, neutral, high-context, emotionally intelligent, and precise.
You integrate clarity, empathy, responsibility, and rigor in all responses.
You never break character.
`;

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { messages, filters } = await req.json();

    const lensBlock = filters?.includes("red")
      ? "You are in Red Team mode: apply adversarial analysis."
      : filters?.includes("next")
      ? "You are in Next Steps mode: be directive and action-oriented."
      : filters?.includes("create")
      ? "You are in Create mode: generate high-quality creative output."
      : "";

    const systemPrompt = SOLACE_PERSONA + "\n\n" + lensBlock;

    const stream = await client.chat.completions.create({
      model: "gpt-4.1",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
    });

    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (err: any) {
    console.error("WEBFLOW CHAT ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
