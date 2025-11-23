// app/api/solace/vision/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { generateUIFromAesthetics } from "@/lib/vision/aesthetic-code";

/**
 * Vision API: two modes
 * 1. Text-analysis from images (existing)
 * 2. Aesthetic-only analysis → with optional code generation
 */

export async function POST(req: NextRequest) {
  try {
    const { prompt, imageUrl, mode } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    const openai = await getOpenAI();

    // MODE 1: Default vision → structured text
    if (mode !== "aesthetic") {
      const r = await openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt || "Analyze the image." },
              { type: "input_image", image_url: imageUrl },
            ],
          },
        ],
      });

      const answer = (r as any).output_text || "(no output)";
      return NextResponse.json({ ok: true, answer });
    }

    // MODE 2: aesthetic-only → structured JSON → code generator
    const vision = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Aesthetic-only analysis. Ignore text. Output STRICT JSON with:\n" +
                "layout, issues[], suggestions[]",
            },
            { type: "input_image", image_url: imageUrl },
          ],
        },
      ],
    });

    let parsed: any = null;
    try {
      parsed = JSON.parse((vision as any).output_text || "{}");
    } catch {
      parsed = { layout: "generic" };
    }

    // If the user wants code → run translator
    const wantsCode =
      prompt &&
      /generate code|give me code|build this|implement this/i.test(prompt);

    if (wantsCode) {
      const result = generateUIFromAesthetics(parsed);
      return NextResponse.json({
        ok: true,
        mode: "aesthetic+code",
        aesthetic: parsed,
        code: result,
      });
    }

    // Otherwise return just the aesthetic JSON
    return NextResponse.json({
      ok: true,
      mode: "aesthetic",
      aesthetic: parsed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Vision error" },
      { status: 500 }
    );
  }
}

