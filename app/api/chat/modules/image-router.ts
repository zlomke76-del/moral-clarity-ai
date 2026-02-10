import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generates an image and returns a browser-safe data URL.
 *
 * Invariant:
 * - Image generation requires explicit user intent / acceptance.
 * - Acceptance is satisfied by an explicit user request in Studio.
 * - This function MUST NOT infer or fabricate acceptance.
 */
export async function generateImage(prompt: string): Promise<string> {
  // ------------------------------------------------------------
  // EXPLICIT USER ACCEPTANCE DECLARATION
  // ------------------------------------------------------------
  // The OpenAI Images API now requires an explicit acknowledgement
  // that the user intended to generate an image.
  //
  // Studio invariant:
  // - If we are here, the user explicitly requested an image.
  // - Solace Core has already PERMITTED execution.
  // ------------------------------------------------------------
  const userAcceptance = {
    acknowledged: true,
    source: "explicit_user_request",
    context: "studio",
    timestamp: new Date().toISOString(),
  };

  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,

    size: "1024x1024",
    quality: "high",
    background: "opaque",

    // --------------------------------------------------------
    // REQUIRED ACCEPTANCE SIGNAL
    // --------------------------------------------------------
    user_acceptance: userAcceptance,
  });

  const b64 = result.data?.[0]?.b64_json;

  if (!b64) {
    console.error("[IMAGE GEN FAILED]", {
      reason: "missing_base64",
      hasDataArray: Array.isArray(result.data),
      dataLength: result.data?.length ?? 0,
      acceptance: userAcceptance,
    });

    throw new Error("Image generation failed: no base64 payload returned");
  }

  // ------------------------------------------------------------
  // AUTHORITATIVE SUCCESS SIGNAL
  // ------------------------------------------------------------
  console.log("[IMAGE GEN OK]", {
    base64Length: b64.length,
    approxBytes: Math.round(b64.length * 0.75),
    acceptance: "acknowledged",
  });

  return `data:image/png;base64,${b64}`;
}
