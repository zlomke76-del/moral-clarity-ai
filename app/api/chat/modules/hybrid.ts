// --------------------------------------------------------------
// HYBRID PIPELINE — INTERNAL LENSES, SINGLE VOICE OUTPUT
// Newsroom hard-enforced when required
// Responses API compatible
// --------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------
export type HybridArgs = {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
  governorLevel?: number;
  governorInstructions?: string;
  forceNewsroom?: boolean;
};

// --------------------------------------------------------------
// ASCII SANITIZER
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// --------------------------------------------------------------
// MAIN PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: HybridArgs) {
  const {
    userMessage,
    context,
    ministryMode = false,
    founderMode = false,
    modeHint = "",
    governorLevel = 0,
    governorInstructions = "",
    forceNewsroom = false,
  } = args;

  // ------------------------------------------------------------
  // INTERNAL LENSES (NOT USER-VISIBLE)
  // ------------------------------------------------------------
  const optimistStarted = Date.now();
  const optimist = await callModel(
    "gpt-4.1-mini",
    `Provide constructive opportunities related to:\n${userMessage}`
  );
  const optimistFinished = Date.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: userMessage,
    output: optimist,
    started: optimistStarted,
    finished: optimistFinished,
  });

  const skepticStarted = Date.now();
  const skeptic = await callModel(
    "gpt-4.1-mini",
    `Identify risks, constraints, and uncertainties related to:\n${userMessage}`
  );
  const skepticFinished = Date.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: userMessage,
    output: skeptic,
    started: skepticStarted,
    finished: skepticFinished,
  });

  // ------------------------------------------------------------
  // ARBITER (SOLE VOICE)
  // ------------------------------------------------------------
  const domain = forceNewsroom ? "newsroom" : "core";

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      domain,
      `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

NEWSROOM CONTRACT (ENFORCED WHEN ACTIVE):
- Use ONLY the provided neutral news digest.
- Produce exactly THREE stories unless otherwise requested.
- Each story ~400 words.
- Zero bias. No framing language.
- Every story MUST include a source URL from the digest.
- If a source link is missing, EXCLUDE the story.
- Do NOT mention Optimist or Skeptic.
- Speak as ONE unified Solace voice.
`
    )
  );

  const arbiterPrompt = sanitizeASCII(`
${personaSystem}

------------------------------------------------------------
NEUTRAL NEWS DIGEST
------------------------------------------------------------
${forceNewsroom ? JSON.stringify(context.newsDigest, null, 2) : "N/A"}

------------------------------------------------------------
OPTIMIST (INTERNAL)
------------------------------------------------------------
${optimist}

------------------------------------------------------------
SKEPTIC (INTERNAL)
------------------------------------------------------------
${skeptic}

------------------------------------------------------------
USER REQUEST
------------------------------------------------------------
${userMessage}
`);

  const arbiterStarted = Date.now();
  const arbiter = await callModel("gpt-4.1", arbiterPrompt);
  const arbiterFinished = Date.now();

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbiterPrompt.slice(0, 5000),
    output: arbiter,
    started: arbiterStarted,
    finished: arbiterFinished,
  });

  return {
    finalAnswer: arbiter,
  };
}
