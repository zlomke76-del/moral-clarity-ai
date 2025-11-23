// app/api/solace/vision/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generateUIFromAesthetics } from "@/lib/vision/aesthetic-code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Vision endpoint for Solace.
 *
 * Accepts:
 *  - prompt: string
 *  - imageUrl: string (public URL)
 *
 * Returns:
 *  - the model's response
 *  - if the model suggests aesthetic hints, passes them to aesthetic-code helper
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt || "Analyze this image.");
    const imageUrl = String(body.imageUrl || "");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    // --- Vision call ---------------------------------------------------
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high", // REQUIRED in v2 responses API
            },
          ],
        },
      ],
      reasoning: {
        effort: "medium",
      },
    });

    // Extract the text answer
    const rawText =
      response.output_text ??
      response.output?.[0]?.content?.[0]?.text ??
      "[No response]";

    // Try to detect if model returned structured aesthetic hints
    let aestheticsBlock = null;
    try {
      const jsonMatch = rawText.match(/<aesthetic>([\s\S]*?)<\/aesthetic>/);
      if (jsonMatch) {
        aestheticsBlock = JSON.parse(jsonMatch[1]);
      }
    } catch {
      // ignore parsing errors silently
    }

    // If structured aesthetics found → return translated Tailwind/React code too
    if (aestheticsBlock) {
      const uiCode = generateUIFromAesthetics(aestheticsBlock);
      return NextResponse.json({
        answer: rawText,
        aesthetics: aestheticsBlock,
        generatedUI: uiCode,
      });
    }

    // Default: return raw text response
    return NextResponse.json({
      answer: rawText,
    });
  } catch (err: any) {
    console.error("Vision route error:", err);
    return NextResponse.json(
      { error: err?.message || "Vision analysis failed" },
      { status: 500 }
    );
  }
}
