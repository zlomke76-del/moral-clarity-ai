// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Hybrid Pipeline (Optimist → Skeptic → Arbiter)
// All three use callModel() which wraps /v1/responses cleanly
//--------------------------------------------------------------

import { callModel } from "./callModel";

export async function orchestrateSolaceResponse({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
}: any) {
  try {
    // ------------------------------
    // 1. OPTIMIST PASS
    // ------------------------------
    const optimistPayload = {
      stage: "optimist",
      userMessage,
      context,
      history,
      ministryMode,
      founderMode,
      canonicalUserKey,
    };

    const optimistText = await callModel("gpt-4.1-mini", optimistPayload);

    // ------------------------------
    // 2. SKEPTIC PASS
    // ------------------------------
    const skepticPayload = {
      stage: "skeptic",
      userMessage,
      context,
      history,
      ministryMode,
      founderMode,
      canonicalUserKey,
      optimistText,
    };

    const skepticText = await callModel("gpt-4.1-mini", skepticPayload);

    // ------------------------------
    // 3. ARBITER PASS (final integrator)
    // ------------------------------
    const arbiterPayload = {
      stage: "arbiter",
      userMessage,
      context,
      history,
      ministryMode,
      founderMode,
      canonicalUserKey,
      optimistText,
      skepticText,
    };

    const finalText = await callModel("gpt-4.1", arbiterPayload);

    return finalText || "[Hybrid pipeline produced no output]";
  } catch (err) {
    console.error("[ORCHESTRATOR] failure:", err);
    return "[Hybrid pipeline error]";
  }
}

