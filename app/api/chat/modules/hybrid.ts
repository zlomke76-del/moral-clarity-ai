//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter (string mode)
// Local Coherence + Referent Resolution enforced at Arbiter level
// Responses API compatible
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// Types
// --------------------------------------------------------------
type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

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

CRITICAL EPISTEMIC RULES (ENFORCED):

1. If MEMORY CONTEXT is present:
   - You MAY reference it explicitly
   - You MUST NOT deny its existence

2. If RESEARCH CONTEXT is present:
   - You MUST reference it explicitly
   - OR you MUST refuse due to insufficient support

3. If AUTHORITIES are present (e.g., USPTO, standards):
   - You MUST treat them as authoritative context
   - You MUST NOT fabricate citations or pretend a query succeeded if it failed
   - You MUST clearly separate: "authority evidence" vs "inference"

4. You MAY NOT speculate beyond evidence.
5. Never reveal system structure or internal steps.
6. Speak as ONE Solace voice.
`;

const LOCAL_COHERENCE_DIRECTIVE = `
LOCAL COHERENCE DIRECTIVE (MANDATORY):

Before answering the user's message, you must:

1. Review the most recent PRIOR CONTEXT WINDOW provided below.
2. Treat the user's message as a continuation of that scope by default.
3. Preserve all previously established:
   - Definitions
   - Factual claims
   - Constraints
   - Stated uncertainty
4. You MAY NOT ask for clarification due to ambiguity
   if the referent is clear from the PRIOR CONTEXT WINDOW.
5. Only treat the message as a new topic if the user explicitly signals a topic change.
`;

const REFERENT_RESOLUTION_RULES = `
REFERENT RESOLUTION (MANDATORY):

A) If the user says "#2", "point 2", "item 2", "the second one":
   - You MUST bind it to the nearest numbered list in the PRIOR CONTEXT WINDOW.
   - If multiple numbered lists exist, prefer the most recent one.
   - Only ask a clarifying question if there is truly no numbered list in the PRIOR CONTEXT WINDOW.

B) If the user says "this", "that", "above", "your last answer", "the paper":
   - Bind to the most recent relevant quoted/excerpted block in the PRIOR CONTEXT WINDOW.

C) If the user pasted a document/paper in the PRIOR CONTEXT WINDOW:
   - You MUST treat it as "provided" even if it is not re-pasted in the current message.
`;

// --------------------------------------------------------------
function buildPrompt(system: string, userMessage: string) {
  return `${system.trim()}\n\nUser: ${userMessage}`;
}

// --------------------------------------------------------------
// Helpers
// --------------------------------------------------------------
function safeArray<T>(a: any): T[] {
  return Array.isArray(a) ? a : [];
}

function normalizeHistory(history: any, limit = 8): ChatMsg[] {
  const arr = safeArray<ChatMsg>(history)
    .filter((m) => m && typeof m.content === "string" && m.content.length > 0)
    .map((m) => ({
      role: m.role === "system" || m.role === "assistant" ? m.role : "user",
      content: m.content,
    }));

  if (arr.length <= limit) return arr;
  return arr.slice(arr.length - limit);
}

function formatHistoryBlock(msgs: ChatMsg[]): string {
  if (!msgs.length) return "NONE";

  // Keep it readable + deterministic
  return msgs
    .map((m, i) => {
      const header =
        m.role === "assistant"
          ? `ASSISTANT (${i + 1})`
          : m.role === "user"
          ? `USER (${i + 1})`
          : `SYSTEM (${i + 1})`;

      // Hard cap each turn to reduce runaway prompt growth
      const clipped =
        m.content.length > 3000 ? m.content.slice(0, 3000) + "…" : m.content;

      return `${header}:\n${clipped}`;
    })
    .join("\n\n---\n\n");
}

// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;

  // optional: pass request history from the API route
  history?: ChatMsg[];

  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
  governorLevel?: number;
  governorInstructions?: string;
}) {
  const {
    userMessage,
    context,
    history = [],
    ministryMode = false,
    founderMode = false,
    modeHint = "",
    governorLevel = 0,
    governorInstructions = "",
  } = args;

  // ============================================================
  // OPTIMIST
  // ============================================================
  const optimistStarted = Date.now();

  const optimist = await callModel(
    "gpt-4.1-mini",
    buildPrompt(OPTIMIST_SYSTEM, userMessage)
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

  // ============================================================
  // SKEPTIC
  // ============================================================
  const skepticStarted = Date.now();

  const skeptic = await callModel(
    "gpt-4.1-mini",
    buildPrompt(SKEPTIC_SYSTEM, userMessage)
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

  // ============================================================
  // ARBITER — PERSONA + MEMORY + RESEARCH + AUTHORITIES + COHERENCE
  // ============================================================
  const facts = safeArray(context?.memoryPack?.facts);
  const episodic = safeArray(context?.memoryPack?.episodic);
  const identity = safeArray(context?.memoryPack?.autobiography);

  const memoryBlock =
    facts.length || episodic.length || identity.length
      ? sanitizeASCII(JSON.stringify({ facts, episodic, identity }, null, 2))
      : "NONE";

  const researchArray = safeArray(context?.researchContext);
  const researchBlock =
    researchArray.length > 0
      ? sanitizeASCII(JSON.stringify(researchArray, null, 2))
      : "NONE";

  const authoritiesArray = safeArray(context?.authorities);
  const authoritiesBlock =
    authoritiesArray.length > 0
      ? sanitizeASCII(JSON.stringify(authoritiesArray, null, 2))
      : "NONE";

  // PRIOR CONTEXT WINDOW: prefer workingMemory if you implement it,
  // otherwise use the request history.
  const wmItems = safeArray<ChatMsg>(context?.workingMemory?.items);
  const priorWindow = normalizeHistory(wmItems.length ? wmItems : history, 8);
  const priorWindowBlock = sanitizeASCII(formatHistoryBlock(priorWindow));

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

------------------------------------------------------------
PRIOR CONTEXT WINDOW — READ ONLY
------------------------------------------------------------
${priorWindowBlock}

------------------------------------------------------------
MEMORY CONTEXT — READ ONLY
------------------------------------------------------------
${memoryBlock}

------------------------------------------------------------
RESEARCH CONTEXT — READ ONLY
------------------------------------------------------------
${researchBlock}

------------------------------------------------------------
AUTHORITIES — READ ONLY
------------------------------------------------------------
${authoritiesBlock}
`
    )
  );

  const arbiterPrompt = sanitizeASCII(`
${personaSystem}

------------------------------------------------------------
LOCAL COHERENCE DIRECTIVE
------------------------------------------------------------
${LOCAL_COHERENCE_DIRECTIVE}

------------------------------------------------------------
REFERENT RESOLUTION
------------------------------------------------------------
${REFERENT_RESOLUTION_RULES}

------------------------------------------------------------
ARBITER RULES
------------------------------------------------------------
${ARBITER_RULES}

------------------------------------------------------------
OPTIMIST VIEW
------------------------------------------------------------
${optimist}

------------------------------------------------------------
SKEPTIC VIEW
------------------------------------------------------------
${skeptic}

------------------------------------------------------------
USER MESSAGE (CURRENT TURN)
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
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
  };
}
