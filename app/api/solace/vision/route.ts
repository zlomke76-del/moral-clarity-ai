// app/api/solace/vision/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generateUIFromAesthetics } from "@/lib/vision/aesthetic-code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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

    // --- Vision API call ------------------------------------------------
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high", // REQUIRED
            },
          ],
        },
      ],
      reasoning: { effort: "medium" },
    });

    // --- SAFE TEXT EXTRACTION (OpenAI v2 compliant) ---------------------
    let rawText: string = response.output_text ?? "";

    if (!rawText && Array.isArray(response.output)) {
      const msgs = response.output
        .filter((o: any) => o.type === "message")
        .flatMap((o: any) => o.content || [])
        .map((c: any) => c.text || "");

      rawText = msgs.join(" ").trim();
    }

    if (!rawText) rawText = "[No response]";

    // --- parse <aesthetic> JSON blocks ----------------------------------
    let aestheticsBlock = null;

    try {
      const match = rawText.match(/<aesthetic>([\s\S]*?)<\/aesthetic>/);
      if (match) aestheticsBlock = JSON.parse(match[1]);
    } catch {
      // ignore
    }

    // --- If aesthetics found → generate UI code -------------------------
    if (aestheticsBlock) {
      const uiCode = generateUIFromAesthetics(aestheticsBlock);
      return NextResponse.json({
        answer: rawText,
        aesthetics: aestheticsBlock,
        generatedUI: uiCode,
      });
    }

    // --- Default: return plain text -------------------------------------
    return NextResponse.json({ answer: rawText });
  } catch (err: any) {
    console.error("Vision route error:", err);
    return NextResponse.json(
      { error: err?.message || "Vision analysis failed" },
      { status: 500 }
    );
  }
}
