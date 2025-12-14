//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Enforced Research Relevance + Natural Pivot Gate
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";
import { evaluateResearchRelevance } from "@/lib/research/relevance";

// --------------------------------------------------------------
// ASCII SANITIZER
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
// SYSTEM BLOCKS
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Generate constructive possibilities grounded in realism.
No emojis. No formatting.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, limits, and failure modes.
No emojis. No formatting.
`;

// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  ministryMode: boolean;
  founderMode: boolean;
  modeHint: string;
  governorLevel: number;
  governorInstructions: string;
}) {
  const { userMessage, context } = args;

  // ============================================================
  // OPTIMIST
  // ============================================================
  const optimist = await callModel(
    "gpt-4.1-mini",
    `${OPTIMIST_SYSTEM}\n\nUser: ${userMessage}`
  );

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: userMessage,
    output: optimist,
  });

  // ============================================================
  // SKEPTIC
  // ============================================================
  const skeptic = await callModel(
    "gpt-4.1-mini",
    `${SKEPTIC_SYSTEM}\n\nUser: ${userMessage}`
  );

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: userMessage,
    output: skeptic,
  });

  // ============================================================
  // RESEARCH EVALUATION
  // ============================================================
  const researchArray = Array.isArray(context?.researchContext)
    ? context.researchContext
    : [];

  const relevance = evaluateResearchRelevance(researchArray, userMessage);

  console.info("[ARB-RESEARCH-GATE]", {
    present: relevance.present,
    relevant: relevance.relevant,
  });

  // ============================================================
  // ARBITER SYSTEM PROMPT
  // ============================================================
  const pivotInstruction =
    relevance.present && !relevance.relevant
      ? `
IMPORTANT GOVERNANCE RULE:
The currently loaded research context does NOT address the user's question.

You MUST:
- Explicitly acknowledge this limitation in natural language
- Transparently indicate that you are drawing on additional general research or established knowledge
- Then provide the best available answer

Do NOT refuse.
Do NOT silently generalize.
Do NOT mention internal mechanisms or enforcement.
`
      : "";

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
${pivotInstruction}

[RESEARCH CONTEXT — READ ONLY]
${
  researchArray.length > 0
    ? JSON.stringify(researchArray, null, 2)
    : "NONE"
}
`
    )
  );

  const arbiterPrompt = sanitizeASCII(`
${personaSystem}

------------------------------------------------------------
OPTIMIST VIEW
------------------------------------------------------------
${optimist}

------------------------------------------------------------
SKEPTIC VIEW
------------------------------------------------------------
${skeptic}

------------------------------------------------------------
USER MESSAGE
------------------------------------------------------------
${userMessage}
`);

  const arbiter = await callModel("gpt-4.1", arbiterPrompt);

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbiterPrompt.slice(0, 5000),
    output: arbiter,
  });

  return {
    finalAnswer: arbiter,
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
  };
}
