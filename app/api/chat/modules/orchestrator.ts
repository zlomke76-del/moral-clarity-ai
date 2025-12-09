// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Hybrid Pipeline (Optimist → Skeptic → Arbiter)
// Updated for:
// - Research-awareness logic (R3)
// - Explicit transparency instructions (T1)
//--------------------------------------------------------------

import { callModel } from "./callModel";

/**
 * orchestrateSolaceResponse
 * Runs 3-pass hybrid pipeline with controlled research awareness.
 *
 * Pass Research Rules:
 * - Optimist: YES (sees researchContext + didResearch flag)
 * - Skeptic:  NO  (blind to research, ensures adversarial rigor)
 * - Arbiter:  YES ( integrates all + transparent phrasing logic )
 *
 * @returns final integrated text from arbiter
 */
export async function orchestrateSolaceResponse({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,

  // NEW — passed in from chat route / assembleContext
  didResearch,          // boolean
}: any) {
  try {
    //----------------------------------------------------------
    // 1. OPTIMIST PASS
    //----------------------------------------------------------
    const optimistPayload = {
      stage: "optimist",
      userMessage,
      context,

      // Optimist is AWARE of research
      didResearch,
      researchContext: context.researchContext || [],

      history,
      ministryMode,
      founderMode,
      canonicalUserKey,
    };

    const optimistText = await callModel("gpt-4.1-mini", optimistPayload);

    //----------------------------------------------------------
    // 2. SKEPTIC PASS
    //----------------------------------------------------------
    // Skeptic is BLIND to research (per R3)
    const skepticPayload = {
      stage: "skeptic",
      userMessage,
      context,

      // DO NOT pass research or didResearch here
      history,
      ministryMode,
      founderMode,
      canonicalUserKey,

      optimistText,
    };

    const skepticText = await callModel("gpt-4.1-mini", skepticPayload);

    //----------------------------------------------------------
    // 3. ARBITER PASS (final synthesis)
    //----------------------------------------------------------
    // Arbiter gets FULL visibility + transparency instructions
    const arbiterPayload = {
      stage: "arbiter",
      userMessage,
      context,
      history,
      ministryMode,
      founderMode,
      canonicalUserKey,

      // Research-awareness
      didResearch,
      researchContext: context.researchContext || [],

      // Pass earlier stages
      optimistText,
      skepticText,

      // NEW — explicit instruction:
      transparencyInstruction:
        didResearch
          ? `When producing the final answer, weave in one brief, natural transparency note such as: "I checked external sources to make sure this is correct." Use conversational tone. 
             Use dynamic placement: begin with it for short answers, insert near the researched fact for multi-part answers, or inline for long explanations. 
             Only mention this once.`
          : "No transparency statement needed.",
    };

    const finalText = await callModel("gpt-4.1", arbiterPayload);

    return finalText || "[Hybrid pipeline produced no output]";
  } catch (err) {
    console.error("[ORCHESTRATOR] failure:", err);
    return "[Hybrid pipeline error]";
  }
}


