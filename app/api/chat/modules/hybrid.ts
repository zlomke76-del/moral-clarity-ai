// --------------------------------------------------------------
// HYBRID PIPELINE — NEWSROOM HARD-ENFORCED
// Unified Solace Voice
// 3 x ~400 word neutral stories
// --------------------------------------------------------------

import { callModel } from "./model-router";
import { logTriadDiagnostics } from "./triad-diagnostics";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------
export type NewsDigestItem = {
  story_title: string;
  story_url: string;
  outlet: string;
  neutral_summary: string;
};

// --------------------------------------------------------------
// ASCII SANITIZER (BOUNDARY SAFETY)
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input
    .split("")
    .map((c) => (c.charCodeAt(0) > 255 ? "?" : c))
    .join("");
}

// --------------------------------------------------------------
// NEWSROOM ARBITER PROMPT (HARD CONTRACT)
// --------------------------------------------------------------
function buildNewsroomPrompt(
  persona: string,
  stories: NewsDigestItem[]
): string {
  return sanitizeASCII(`
${persona}

YOU ARE IN STRICT NEWSROOM MODE.

ABSOLUTE RULES (NON-NEGOTIABLE):

1. Use ONLY the provided neutral summaries.
2. DO NOT add facts, framing, interpretation, or speculation.
3. Write EXACTLY THREE STORIES.
4. EACH STORY MUST BE APPROXIMATELY 400 WORDS.
   - Minimum: 350 words
   - Maximum: 450 words
5. EACH STORY MUST INCLUDE:
   - Title
   - Neutral narrative prose
   - Source citation with full URL
6. Maintain a SINGLE unified Solace voice.
7. NO references to internal lenses, models, or reasoning steps.

FAILURE TO FOLLOW THESE RULES IS AN ERROR.

------------------------------------------------------------
NEUTRAL NEWS DIGEST (AUTHORITATIVE)
------------------------------------------------------------
${stories
  .slice(0, 3)
  .map(
    (s, i) => `
STORY ${i + 1}
TITLE: ${s.story_title}
OUTLET: ${s.outlet}
URL: ${s.story_url}
NEUTRAL SUMMARY:
${s.neutral_summary}
`
  )
  .join("\n\n")}
`);
}

// --------------------------------------------------------------
// MAIN PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
}) {
  const {
    userMessage,
    context,
    ministryMode = false,
    founderMode = false,
    modeHint = "",
  } = args;

  const personaSystem = sanitizeASCII(
    buildSolaceSystemPrompt(
      "newsroom",
      `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}
`
    )
  );

  // ------------------------------------------------------------
  // NEWSROOM PATH (ONLY)
  // ------------------------------------------------------------
  if (!context.newsDigest || context.newsDigest.length < 3) {
    return {
      finalAnswer:
        "No sufficient neutral news digest is available. I will not speculate.",
    };
  }

  const arbiterPrompt = buildNewsroomPrompt(
    personaSystem,
    context.newsDigest as NewsDigestItem[]
  );

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
