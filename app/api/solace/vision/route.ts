// app/api/solace/vision/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { buildVisionSystemPrompt } from "@/lib/solace/vision-mode";
import { getSolaceFeatureFlags } from "@/lib/solace/settings";

// Local defaults so we don't depend on lib/mcai/config
const SOLACE_VISION_MODEL =
  process.env.OPENAI_RESPONSE_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4.1";
const SOLACE_VISION_TIMEOUT_MS = 60_000;

function jsonError(
  message: string,
  status = 400,
  extra: Record<string, unknown> = {}
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/**
 * This route assumes you send:
 * - multipart/form-data with field "image" (File)
 * - optional "prompt" (string) for user intent
 *
 * It uses the model to:
 * 1) Apply Solace's visual safety and interpretation rules.
 * 2) Return a text answer only (no images).
 */
export async function POST(req: NextRequest) {
  try {
    const flags = getSolaceFeatureFlags();
    if (!flags.visionEnabled) {
      return jsonError("Vision access for Solace is disabled.", 403, {
        code: "VISION_DISABLED",
      });
    }

    const form = await req.formData();
    const file = form.get("image");
    const userPrompt =
      (form.get("prompt") as string | null) ??
      "Describe what you can safely see and offer practical, nonjudgmental help.";

    if (!(file instanceof File)) {
      return jsonError("Missing 'image' file in form-data.", 400, {
        code: "NO_IMAGE",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/png";

    const openai: any = await getOpenAI();

    const system = buildVisionSystemPrompt(`
You must follow Solace's VISION SAFETY & INTERPRETATION PROTOCOL.

If the image appears to contain restricted content (nudity, explicit sexual content,
graphic violence, criminal activity, weapons, drugs, extremist symbolism, or minors
in unsafe situations), you must respond ONLY with:

"I can’t assist with this image because it contains restricted visual content. If you’d like to describe the situation in words, I can help that way."

Otherwise:
- Briefly describe what is visible.
- Offer 2–3 concrete, nonjudgmental suggestions if appropriate (e.g., for a messy room or sparse fridge).
- Stay practical, kind, and non-shaming.
    `.trim());

    // Use the official multimodal "input_text" + "input_image" shape.
    // Annotated as `any` to avoid TS fighting the SDK types.
    const input: any = [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: system,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: userPrompt,
          },
          {
            type: "input_image",
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
            },
          },
        ],
      },
    ];

    const resp = await openai.responses.create({
      model: SOLACE_VISION_MODEL,
      input,
      max_output_tokens: 900,
      timeout_ms: SOLACE_VISION_TIMEOUT_MS,
    });

    const answer = (resp as any).output_text as string | undefined;

    return NextResponse.json({
      ok: true,
      answer: answer ?? "",
      model: SOLACE_VISION_MODEL,
    });
  } catch (err: any) {
    console.error("[solace/vision] fatal error", err);
    return jsonError(
      err?.message || "Unexpected error in Solace vision route.",
      500,
      { code: "SOLACE_VISION_FATAL" }
    );
  }
}

export async function GET() {
  return jsonError("Use POST with multipart/form-data.", 405, {
    code: "METHOD_NOT_ALLOWED",
  });
}

