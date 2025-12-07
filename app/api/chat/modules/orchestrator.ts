import { runHybridPipeline } from "./hybrid";  // ← REQUIRED
import { callNeutralModel } from "./neutralModel"; // (Only if this exists — otherwise ignore)

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

  const blocks = (context as any).systemPromptBlocks || [];
  const neutralText = await callNeutralModel(blocks);

  return neutralText;
}

