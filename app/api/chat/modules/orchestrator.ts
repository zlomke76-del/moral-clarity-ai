import { runHybridPipeline } from "./hybrid";

//---------------------------------------------------------------
// MAIN ORCHESTRATION FUNCTION (FINAL — RETURNS STRING ONLY)
//---------------------------------------------------------------
export async function orchestrateSolaceResponse(inputs: any): Promise<string> {
  const {
    userMessage,
    context,
    history,
    ministryMode,
    modeHint,
    founderMode,
    canonicalUserKey,
  } = inputs;

  const hybridAllowed =
    modeHint === "Create" ||
    modeHint === "Red Team" ||
    modeHint === "Next Steps" ||
    founderMode;

  if (hybridAllowed) {
    console.log("[ORCHESTRATOR] Running HYBRID pipeline…");

    const finalAnswer = await runHybridPipeline({
      userMessage,
      context,
      history,
      ministryMode,
      modeHint,
      founderMode,
      canonicalUserKey,
    });

    return finalAnswer || "[arbiter produced no text]";
  }

  console.log("[ORCHESTRATOR] Running NEUTRAL mode…");

  // Your existing neutral model call
  const blocks = (context as any).systemPromptBlocks || [];
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      input: blocks,
    }),
  });

  const json = await res.json();
  const block = json.output?.[0]?.content?.[0];
  return block?.text ?? "[No reply]";
}

