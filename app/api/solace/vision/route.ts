// app/api/solace/vision/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { generateUIFromAesthetics } from "@/lib/vision/aesthetic-code";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Aesthetic Engine 4.0 Vision Route
 * - Deterministic <aesthetic> JSON extraction
 * - Supports section detection, repair mode, and UI generation
 * - Fully GPT-4.1 compliant
 * - Zero unsupported parameters
 */

const VISION_MODEL = "gpt-4.1"; // most capable vision model

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* -------------------------------------------------------------------------- */
/*                               SYSTEM PROMPT                                */
/* -------------------------------------------------------------------------- */

const VISION_SYSTEM_PROMPT = `
You are Solace Vision — MCAI’s visual intelligence engine.

Your job is:
1. Detect UI structure (cards, grids, hero, nav, form, modal, dashboard)
2. Identify spacing, alignment, contrast, and hierarchy issues
3. Generate structured JSON inside <aesthetic>...</aesthetic>
4. NEVER guess — only describe what the image shows
5. Allow "repair mode" by providing design corrections

STRICT OUTPUT FORMAT:

<aesthetic>
{
  "sections": [
    {
      "id": "hero | grid | card | navbar | table | form | modal | footer | misc",
      "layout": "one-column | two-column | grid | list | hero | sidebar",
      "issues": ["text too small", "low contrast", "dense layout"],
      "recommendations": [
        "increase vertical spacing",
        "use 2-column layout for clarity"
      ]
    }
  ],
  "global_issues": [],
  "global_recommendations": [],
  "repair_mode": false,
  "notes": ""
}
</aesthetic>

RULES:
- ALWAYS return the <aesthetic> block.
- DO NOT include markdown.
- If user requests code, still include <aesthetic>.
- If UI is unclear, say so inside the JSON, not outside.
`;

/* -------------------------------------------------------------------------- */
/*                               ROUTE HANDLER                                */
/* -------------------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt =
      String(body.prompt ||
        "Analyze this UI for structure, hierarchy, spacing, and usability.");
    const imageUrl = String(body.imageUrl || "");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Missing imageUrl" },
        { status: 400 }
      );
    }

    /* ----------------------------- CALL GPT-4.1 ----------------------------- */
    const response = await client.responses.create({
      model: VISION_MODEL,
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: VISION_SYSTEM_PROMPT }],
        },
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: imageUrl, detail: "high" },
          ],
        },
      ],
      max_output_tokens: 3000,
      temperature: 0.2,
    });

    /* ------------------------- CLEAN TEXT EXTRACTION ------------------------ */
    let rawText = response.output_text || "";

    if (!rawText && Array.isArray(response.output)) {
      const collected = response.output
        .filter((o: any) => o.type === "message")
        .flatMap((o: any) => o.content || [])
        .map((c: any) => c.text || "");
      rawText = collected.join(" ").trim();
    }

    if (!rawText) rawText = "[No response]";

    /* -------------------- EXTRACT <aesthetic> JSON BLOCK -------------------- */
    let aesthetics = null;

    try {
      const match = rawText.match(/<aesthetic>([\s\S]*?)<\/aesthetic>/);
      if (match) aesthetics = JSON.parse(match[1].trim());
    } catch (err) {
      aesthetics = null;
    }

    /* ---------------------- RUN AESTHETIC ENGINE 4.0 ----------------------- */
    if (aesthetics) {
      try {
        const ui = generateUIFromAesthetics(aesthetics);

        return NextResponse.json({
          ok: true,
          answer: rawText,
          aesthetics,
          generatedUI: ui,
        });
      } catch (err: any) {
        console.error("Aesthetic Engine failed:", err);
        return NextResponse.json({
          ok: false,
          answer: rawText,
          aesthetics,
          error: "Failed to generate UI code",
        });
      }
    }

    /* --------------------------- FALLBACK RESPONSE -------------------------- */
    return NextResponse.json({ ok: true, answer: rawText });

  } catch (err: any) {
    console.error("Vision route error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Vision analysis failed" },
      { status: 500 }
    );
  }
}
