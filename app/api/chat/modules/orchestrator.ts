// app/api/chat/modules/orchestrator.ts
//--------------------------------------------------------------
// Solace Hybrid Pipeline — TRACED VERSION
//--------------------------------------------------------------

import { callModel } from "./callModel"; // your internal call helper
// adjust import if needed

export async function orchestrateSolaceResponse({
  userMessage,
  context,
  history,
  ministryMode,
  modeHint,
  founderMode,
  canonicalUserKey,
}: any) {
  console.log("------------------------------------------------------");
  console.log("[ARB-0] Orchestrator START");
  console.log("User:", canonicalUserKey);
  console.log("ModeHint:", modeHint, "Founder:", founderMode);
  console.log("------------------------------------------------------");

  try {
    //
    // 1) OPTIMIST PASS
    //
    console.log("[ARB-1] Optimist: BEGIN");

    const optimist = await safeCall(
      () => callModel("optimist", userMessage, context, history),
      "[ARB-1] Optimist"
    );

    console.log("[ARB-1] Optimist: OUTPUT PREVIEW:", preview(optimist));

    //
    // 2) SKEPTIC PASS
    //
    console.log("[ARB-2] Skeptic: BEGIN");

    const skepticInput = {
      userMessage,
      context,
      history,
      optimist,
    };

    const skeptic = await safeCall(
      () => callModel("skeptic", skepticInput, context, history),
      "[ARB-2] Skeptic"
    );

    console.log("[ARB-2] Skeptic: OUTPUT PREVIEW:", preview(skeptic));

    //
    // 3) ARBITER PASS
    //
    console.log("[ARB-3] Arbiter: BEGIN");

    const arbiterInput = {
      userMessage,
      context,
      history,
      optimist,
      skeptic,
    };

    const arbiter = await safeCall(
      () => callModel("arbiter", arbiterInput, context, history),
      "[ARB-3] Arbiter"
    );

    console.log("[ARB-3] Arbiter: OUTPUT PREVIEW:", preview(arbiter));

    console.log("[ARB-OK] Arbiter returned final text.");
    return arbiter || "[No arbiter answer]";
  } catch (err: any) {
    console.error("[ARB-FATAL] Exception in orchestrator:", err);
    return "[No reply — orchestrator error]";
  }
}

//--------------------------------------------------------------
// SAFE CALL WRAPPER — CATCHES EMPTY / NULL / BAD RESPONSES
//--------------------------------------------------------------
async function safeCall(fn: () => Promise<any>, label: string) {
  try {
    const out = await fn();

    if (!out) {
      console.warn(`${label} returned EMPTY value`, out);
      return "[EMPTY RESPONSE]";
    }

    // non-string responses are a major cause of recursion
    if (typeof out !== "string") {
      console.warn(`${label} returned NON-STRING`, typeof out, out);
      return JSON.stringify(out);
    }

    return out;
  } catch (err) {
    console.error(`${label} threw ERROR:`, err);
    return "[ERROR RESPONSE]";
  }
}

//--------------------------------------------------------------
// PREVIEW UTILITY — KEEP LOG SAFE
//--------------------------------------------------------------
function preview(txt: any) {
  if (!txt) return "[EMPTY]";
  const s = typeof txt === "string" ? txt : JSON.stringify(txt);
  return s.length > 160 ? s.slice(0, 160) + "…" : s;
}


