//--------------------------------------------------------------
// HYBRID PIPELINE — OPTIMIST → SKEPTIC → ARBITER
// Persona + Memory injected ONLY into Arbiter (string mode)
// Responses API compatible
// Memory + prompt sanitized to prevent Unicode / emoji corruption
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
      const code = c.charCodeAt(0);
      if (replacements[c]) return replacements[c];
      if (code > 255) return "?"; // HARD STOP for emojis / unicode
      return c;
    })
    .join("");
}

// --------------------------------------------------------------
// SYSTEM BLOCKS (PLAIN TEXT ONLY)
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
You are the OPTIMIST lens.
Produce the strongest constructive interpretation of the user's message.
Grounded, realistic, opportunity-focused.
No emojis. No icons. No formatting.
Short, clear, actionable.
`;

const SKEPTIC_SYSTEM = `
You are the SKEPTIC lens.
Identify risks, constraints, and failure modes.
Factual, precise, sharp.
No emojis. No icons.
Short, clear, analytical.
`;

const ARBITER_RULES = `
You are the ARBITER.
You integrate the Optimist and the Skeptic into ONE unified answer.

Rules:
- Weigh opportunity vs risk objectively.
- Never reveal personas or internal steps.
- Emojis/icons ONLY if the user explicitly asked.
- You speak as ONE Solace voice.

Memory behavior:
- You DO have workspace memory provided below.
- When facts include the user's name, you may use it.
- Never claim memory does not exist if facts are present.
`;

// --------------------------------------------------------------
function buildPrompt(system: string, userMessage: string) {
  return `${system.trim()}\n\nUser: ${userMessage}`;
}

// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  founderMode: boolean;
  modeHint: string;
  canonicalUserKey: string;
  governorLevel: number;
  governorInstructions: string;
}) {
  const {
    userMessage,
    context,
    ministryMode,
    founderMode,
    modeHint,
    governorLevel,
    governorInstructions,
  } = args;

  const safeArray = (a: any) => (Array.isArray(a) ? a : []);

  // ============================================================
  // 1. OPTIMIST
  // ============================================================
  const optPrompt = buildPrompt(OPTIMIST_SYSTEM, userMessage);
  const optStart = performance.now();
  let optimist = await callModel("gpt-4.1-mini", optPrompt);
  const optEnd = performance.now();

  logTriadDiagnostics({
    stage: "optimist",
    model: "gpt-4.1-mini",
    prompt: optPrompt,
    output: optimist,
    started: optStart,
    finished: optEnd,
  });

  if (!optimist || optimist.includes("[Model error]")) {
    optimist = "Optimist failed.";
  }

  // ============================================================
  // 2. SKEPTIC
  // ============================================================
  const skpPrompt = buildPrompt(SKEPTIC_SYSTEM, userMessage);
  const skpStart = performance.now();
  let skeptic = await callModel("gpt-4.1-mini", skpPrompt);
  const skpEnd = performance.now();

  logTriadDiagnostics({
    stage: "skeptic",
    model: "gpt-4.1-mini",
    prompt: skpPrompt,
    output: skeptic,
    started: skpStart,
    finished: skpEnd,
  });

  if (!skeptic || skeptic.includes("[Model error]")) {
    skeptic = "Skeptic failed.";
  }

  // ============================================================
  // 3. ARBITER — MEMORY SANITIZED HERE
  // ============================================================

  const facts = sanitizeASCII(
    JSON.stringify(safeArray(context?.memoryPack?.facts), null, 2)
  );
  const episodic = sanitizeASCII(
    JSON.stringify(safeArray(context?.memoryPack?.episodic), null, 2)
  );
  const autobio = sanitizeASCII(
    JSON.stringify(safeArray(context?.memoryPack?.autobiography), null, 2)
  );
  const research = sanitizeASCII(
    JSON.stringify(safeArray(context?.researchContext), null, 2)
  );
  const news = sanitizeASCII(
    JSON.stringify(safeArray(context?.newsDigest), null, 2)
  );

  // ------------------------------------------------------------
  // MEMORY SANITIZATION DIAG (PROVES EMOJI IMPACT)
  // ------------------------------------------------------------
  console.info("[ARB-MEMORY-SANITIZE]", {
    factsLen: facts.length,
    episodicLen: episodic.length,
    autobioLen: autobio.length,
    researchLen: research.length,
    newsLen: news.length,
  });

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "core",
      `
Governor Level: ${governorLevel}
Governor Instructions: ${governorInstructions}
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

[FACTS]
${facts}

[EPISODIC]
${episodic}

[AUTOBIOGRAPHY]
${autobio}

[RESEARCH]
${research}

[NEWS DIGEST]
${news}
`
    )
  );

  const arbPrompt = sanitizeASCII(`
${personaSystem}

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
USER MESSAGE
------------------------------------------------------------
${userMessage}
`);

  // ------------------------------------------------------------
  // FINAL ARBITER PROMPT DIAG (GROUND TRUTH)
  // ------------------------------------------------------------
  const nonAscii = [...arbPrompt].filter(c => c.charCodeAt(0) > 255);
  console.info("[ARB-PROMPT-INTEGRITY]", {
    length: arbPrompt.length,
    nonAsciiCount: nonAscii.length,
    sample: nonAscii.slice(0, 5),
  });

  const arbStart = performance.now();
  const arbiter = await callModel("gpt-4.1", arbPrompt);
  const arbEnd = performance.now();

  logTriadDiagnostics({
    stage: "arbiter",
    model: "gpt-4.1",
    prompt: arbPrompt.slice(0, 5000),
    output: arbiter,
    started: arbStart,
    finished: arbEnd,
  });

  return {
    finalAnswer: arbiter,
    optimist,
    skeptic,
    arbiter,
    imageUrl: null,
  };
}
