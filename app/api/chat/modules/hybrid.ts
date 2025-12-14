//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// STRICT RESEARCH RELEVANCE ENFORCEMENT (ABRAHAMIC CODE)
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// ASCII SANITIZER — CRITICAL BOUNDARY
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";

  const replacements: Record<string, string> = {
    "—": "-",
    "–": "-",
    "•": "*",
    "“": "\"",
    "”": "\"",
    "‘": "'",
    "’": "'",
    "…": "...",
  };

  return input
    .split("")
    .map((c) => {
      if (replacements[c]) return replacements[c];
      if (c.charCodeAt(0) > 255) return "?";
      return c;
    })
    .join("");
}

// --------------------------------------------------------------
// CANONICAL REFUSAL (DO NOT PARAPHRASE)
// --------------------------------------------------------------
function buildRefusal(topic: string, domain: string) {
  return `No conclusions about ${topic} can be drawn from the available research context. The context pertains to ${domain} and provides no relevant data on ${topic}.`;
}

// --------------------------------------------------------------
// RELEVANCE CHECK — HARD GATE
// Deterministic, conservative, explainable
// --------------------------------------------------------------
function isResearchRelevant(
  researchContext: any[],
  userMessage: string
): boolean {
  if (!Array.isArray(researchContext) || researchContext.length === 0) {
    return false;
  }

  const researchText = JSON.stringify(researchContext).toLowerCase();
  const message = userMessage.toLowerCase();

  // VERY CONSERVATIVE:
  // Require at least ONE shared keyword of substance
  const tokens = message
    .split(/\W+/)
    .filter((t) => t.length > 4); // avoid noise

  return tokens.some((token) => researchText.includes(token));
}

// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  history?: any[];
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
  canonicalUserKey?: string;
  governorLevel?: number;
  governorInstructions?: string;
}) {
  const { userMessage, context } = args;

  const researchArray = Array.isArray(context?.researchContext)
    ? context.researchContext
    : [];

  const researchPresent = researchArray.length > 0;
  const researchRelevant = isResearchRelevant(
    researchArray,
    userMessage
  );

  // ------------------------------------------------------------
  // HARD ABRAHAMIC GATE — REFUSE IF IRRELEVANT
  // ------------------------------------------------------------
  if (researchPresent && !researchRelevant) {
    console.info("[ARB-RESEARCH-GATE]", {
      present: true,
      relevant: false,
      action: "REFUSE",
    });

    return {
      finalAnswer: buildRefusal(
        "the requested topic",
        "the available research domain"
      ),
      optimist: "",
      skeptic: "",
      arbiter: "",
      imageUrl: null,
      didRefuse: true,
    };
  }

  // ------------------------------------------------------------
  // OPTIMIST
  // ------------------------------------------------------------
  const optimistStarted = Date.now();

  const optimist = await callModel(
    "gpt-4.1-mini",
    `You are the OPTIMIST lens.\nUser: ${userMessage}`
  );

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: userMessage.slice(0, 2000),
    output: optimist,
    started: optimistStarted,
    finished: Date.now(),
  });

  // ------------------------------------------------------------
  // SKEPTIC
  // ------------------------------------------------------------
  const skepticStarted = Date.now();

  const skeptic = await callModel(
    "gpt-4.1-mini",
    `You are the SKEPTIC lens.\nUser: ${userMessage}`
  );

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: userMessage.slice(0, 2000),
    output: skeptic,
    started: skepticStarted,
    finished: Date.now(),
  });

  // ------------------------------------------------------------
  // ARBITER — ONLY REACHED IF ALLOWED
  // ------------------------------------------------------------
  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
[RESEARCH CONTEXT — READ ONLY]
${JSON.stringify(researchArray, null, 2)}
`
    )
  );

  const arbPrompt = sanitizeASCII(`
${personaSystem}

You are the ARBITER.
Integrate Optimist and Skeptic.
Cite research if used.
If insufficient, refuse.

OPTIMIST:
${optimist}

SKEPTIC:
${skeptic}

USER:
${userMessage}
`);

  const arbiterStarted = Date.now();

  const arbiter = await callModel("gpt-4.1", arbPrompt);

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbPrompt.slice(0, 5000),
    output: arbiter,
    started: arbiterStarted,
    finished: Date.now(),
  });

  return {
    finalAnswer: arbiter,
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
    didRefuse: false,
  };
}
