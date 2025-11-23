// app/api/solace/vision/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generateUIFromAesthetics } from "@/lib/vision/aesthetic-code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best vision model currently available (OpenAI 2025)
const VISION_MODEL = "gpt-4.1";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt || "Analyze this UI image for visual clarity, hierarchy, spacing, and usability.");
    const imageUrl = String(body.imageUrl || "");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    /**
     * GPT-4.1 Vision — correct input format:
     * - `role: "user"`
     * - `content: [ { type: "input_text", text }, { type: "input_image", image_url, detail } ]`
     */
    const response = await client.responses.create({
      model: VISION_MODEL,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high",
            }
          ]
        }
      ],
      // ⚠️ GPT-4.1 does NOT support reasoning.effort — so we keep it clean
      max_output_tokens: 2000,
      temperature: 0.2
    });

    // --- TEXT EXTRACTION -------------------------------------------------
    let rawText: string = response.output_text ?? "";

    if (!rawText && Array.isArray(response.output)) {
      const texts = response.output
        .filter((o: any) => o.type === "message")
        .flatMap((o: any) => o.content || [])
        .map((c: any) => c.text || "");

      rawText = texts.join(" ").trim();
    }

    if (!rawText) rawText = "[No response]";

    // --- PARSE <aesthetic> BLOCK ----------------------------------------
    let aesthetics = null;

    try {
      const match = rawText.match(/<aesthetic>([\s\S]*?)<\/aesthetic>/);
      if (match) {
        aesthetics = JSON.parse(match[1]);
      }
    } catch {
      aesthetics = null;
    }

    // --- GENERATE UI CODE FROM HINTS ------------------------------------
    if (aesthetics) {
      const ui = generateUIFromAesthetics(aesthetics);
      return NextResponse.json({
        answer: rawText,
        aesthetics,
        generatedUI: ui
      });
    }

    // --- OTHERWISE JUST RETURN TEXT -------------------------------------
    return NextResponse.json({ answer: rawText });

  } catch (err: any) {
    console.error("Vision route error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Vision analysis failed" },
      { status: 500 }
    );
  }
}
