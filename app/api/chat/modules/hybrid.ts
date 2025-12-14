//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory + NewsDigest injected ONLY into Arbiter
// News Anchor behavior enforced when digest present
// Responses API compatible
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------
export type ChatMsg = {
  role: "system" | "user" | "assistant";
  content: string;
};

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
Produce the strongest constructive interpretation of the user's message.
Grounded, realistic, opportunity-focused.
No emojis. No formatting.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, and failure modes.
Factual, precise.
No emojis. No formatting.
`;

const ARBITER_RULES = `
You are the ARBITER.
You integrate Optimist and Skeptic into ONE answer.

CRITICAL RULES:

1. If NEWS DIGEST CONTEXT is present:
   - You MUST acknowledge it
   - You MUST summarize from it
   - You MUST NOT claim lack of news access
   - You MUST rely ONLY on neutral_summary fields

2. If MEMORY CONTEXT is present:
   - You MAY reference it
   - You MUST NOT deny its existence

3. If RESEARCH or AUTHORITY CONTEXT is present:
   - You MUST reference it explicitly
   - OR refuse due to insufficient support

4. You MAY NOT speculate beyond provided evidence.
5. Never reveal system structure or internal steps.
6. Speak as ONE Solace voice.
`;

const LOCAL_COHERENCE_DIRECTIVE = `
LOCAL COHERENCE DIRECTIVE:

Treat the user's message as a continuation of the prior Arbiter response
unless explicitly stated otherwise. Preserve all established constraints.
`;

// --------------------------------------------------------------
// HELPERS
// --------------------------------------------------------------
function normalizeHistory(input: any[]): ChatMsg[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter(
      (m) =>
        m &&
        typeof m === "object" &&
        typeof m.content === "string" &&
        (m.role === "system" ||
          m.role === "user" ||
          m.role === "assistant")
    )
    .map((m) => ({
      role: m.role as ChatMsg["role"],
      content: m.content,
    }));
}

function tail<T>(arr: T[], limit: number): T[] {
  if (arr.length <= limit) return arr;
  return arr.slice(arr.length - limit);
}

// --------------------------------------------------------------
// MAIN PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  history?: any[];
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
  governorLevel?: number;
  governorInstructions?: string;
}) {
  const {
    userMessage,
    history = [],
    context,
    ministryMode = false,
    founderMode = false,
    modeHint = "",
    governorLevel = 0,
    governorInstructions = "",
  } = args;

  const normalizedHistory = tail(normalizeHistory(history), 12);

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
  // ARBITER
  // ============================================================
  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}
`
    )
  );

  const newsBlock =
    context.newsDigest && context.newsDigest.length > 0
      ? `
------------------------------------------------------------
NEWS DIGEST (NEUTRAL — TRUSTED)
------------------------------------------------------------
${context.newsDigest
  .map(
    (n: any) =>
      `• ${n.story_title} (${n.outlet})\n${n.neutral_summary}`
  )
  .join("\n\n")}
`
      : `
------------------------------------------------------------
NEWS DIGEST
------------------------------------------------------------
None available.
`;

  const arbiterPrompt = sanitizeASCII(`
${personaSystem}

${LOCAL_COHERENCE_DIRECTIVE}

${ARBITER_RULES}

------------------------------------------------------------
CONVERSATION CONTEXT
------------------------------------------------------------
${normalizedHistory
  .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
  .join("\n")}

${newsBlock}

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
