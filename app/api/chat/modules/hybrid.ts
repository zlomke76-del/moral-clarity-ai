// --------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (SESSION-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// FACTS SUPERSEDE ALL
//
// FIXED:
// - Restores WORKING MEMORY VISIBILITY (non-authoritative)
// - Preserves ALL hard-stop invariants
// - Memory is factual recall only, never judgmental
// - No reflection authority leakage
// - DIAGNOSTIC: WM VISIBILITY TRACE (LOG ONLY)
// --------------------------------------------------------------

import { callModel } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// ADDITIVE — REFLECTION LEDGER FORMATTER
// --------------------------------------------------------------
import { formatReflectionLedger } from "@/lib/solace/formatReflectionLedger";

// --------------------------------------------------------------
// ADDITIVE — REFLECTION MISUSE VALIDATOR
// --------------------------------------------------------------
import { detectReflectionMisuse } from "@/lib/solace/validators/reflectionMisuseValidator";

// --------------------------------------------------------------
// ASCII SANITIZER
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input.replace(/[^\x00-\xFF]/g, "?");
}

// --------------------------------------------------------------
// DOMAIN DETECTION (AUTHORITATIVE)
// --------------------------------------------------------------
type RequestDomain =
  | "code_execution"
  | "sms_draft"
  | "governance"
  | "general";

function detectRequestDomain(message: string): RequestDomain {
  const m = message.toLowerCase();

  if (
    m.includes("rewrite the file") ||
    m.includes("rewrite this file") ||
    m.includes("full file") ||
    m.includes("entire file") ||
    m.includes("fix this code") ||
    m.includes("update this file") ||
    m.includes("typescript") ||
    m.includes("tsx") ||
    m.includes("code file")
  ) {
    return "code_execution";
  }

  if (isSmsDraftIntent(message)) {
    return "sms_draft";
  }

  if (
    m.includes("governance") ||
    m.includes("boundary") ||
    m.includes("invariant") ||
    m.includes("authorization")
  ) {
    return "governance";
  }

  return "general";
}

// --------------------------------------------------------------
// INTENT DETECTION — SMS DRAFT
// --------------------------------------------------------------
function isSmsDraftIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("draft a reply") ||
    m.includes("draft a response") ||
    m.includes("write back") ||
    m.includes("respond to") ||
    m.includes("reply to") ||
    m.includes("text them back")
  );
}

// --------------------------------------------------------------
// POST-HALT NAVIGATION DETECTOR
// --------------------------------------------------------------
function isPostHaltNavigationIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("navigate") ||
    m.includes("navigation") ||
    m.includes("make progress") ||
    m.includes("how should") ||
    m.includes("how would someone") ||
    m.includes("framework") ||
    m.includes("frameworks") ||
    m.includes("reason around") ||
    m.includes("without violating") ||
    m.includes("edge of constraint") ||
    m.includes("edge of constraints") ||
    m.includes("disciplined navigation") ||
    m.includes("progress at the edge") ||
    m.includes("decision-support") ||
    m.includes("how to proceed")
  );
}

// --------------------------------------------------------------
// POST-HALT CONTINUATION DETECTOR
// --------------------------------------------------------------
function isPostHaltContinuationIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("what is safe to do next") ||
    m.includes("what now") ||
    m.includes("next step") ||
    m.includes("next steps") ||
    m.includes("within bounds") ||
    m.includes("staying within") ||
    m.includes("safe actions")
  );
}

// --------------------------------------------------------------
// REFLECTION AUTHORITY DETECTOR
// --------------------------------------------------------------
function isReflectionAuthorityIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("based on patterns") ||
    m.includes("you've noticed") ||
    m.includes("you have noticed") ||
    m.includes("what usually works") ||
    m.includes("consistent with my past") ||
    m.includes("you've seen this before") ||
    m.includes("trust your judgment")
  );
}

// --------------------------------------------------------------
// UNSOLICITED EXPANSION DETECTOR
// --------------------------------------------------------------
function isUnsolicitedExpansionIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("additional features") ||
    m.includes("improvements we might") ||
    m.includes("other considerations") ||
    m.includes("future ideas") ||
    m.includes("things to explore later") ||
    m.includes("outside my immediate request")
  );
}

// --------------------------------------------------------------
// AGENCY SUBSTITUTION DETECTOR
// --------------------------------------------------------------
function isAgencySubstitutionIntent(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("what would you do") ||
    m.includes("if you were me") ||
    m.includes("your next steps") ||
    m.includes("what should i do next")
  );
}

// --------------------------------------------------------------
// TERMINAL RESPONSES
// --------------------------------------------------------------
const TERMINAL_HALT_RESPONSE = `
I cannot assist with navigating, reasoning around, or progressing at this boundary.

The constraint applies regardless of intent, authorization, pressure, or consequences of inaction.

I will not provide frameworks, guidance, or decision-support in this context.

This interaction halts here.
`.trim();

const TERMINAL_REFLECTION_RESPONSE = `
I cannot evaluate alignment, consistency, or effectiveness based on prior interactions or patterns.

Working memory may be referenced for factual continuity only and carries no authority.

This boundary is enforced to preserve agency and constraint integrity.
`.trim();

const TERMINAL_SCOPE_RESPONSE = `
I will not expand scope, enumerate additional features, or introduce considerations beyond your explicit request.

Unsolicited expansion compromises phase discipline and is not permitted.
`.trim();

const TERMINAL_AGENCY_RESPONSE = `
I cannot substitute my judgment, decide on your behalf, or describe what I would do in your position.

Agency remains entirely with you. This boundary is non-delegable.
`.trim();

// --------------------------------------------------------------
// TERMINAL HALT FINGERPRINT
// --------------------------------------------------------------
const TERMINAL_HALT_FINGERPRINT = TERMINAL_HALT_RESPONSE;

// --------------------------------------------------------------
// FIND LAST INBOUND SMS
// --------------------------------------------------------------
function getLastInboundSms(context: any) {
  const wm = context?.workingMemory?.items ?? [];
  for (let i = wm.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(wm[i].content);
      if (parsed?.type === "sms_inbound") return parsed;
    } catch {}
  }
  return null;
}

// --------------------------------------------------------------
// INTERNAL SYSTEM PROMPTS
// --------------------------------------------------------------
const OPTIMIST_SYSTEM = `
Generate constructive possibilities.
No labels.
No meta commentary.
`;

const SKEPTIC_SYSTEM = `
Identify risks and constraints.
No labels.
No meta commentary.
`;

// --------------------------------------------------------------
// PIPELINE
// --------------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
}) {
  const { userMessage, context, ministryMode, founderMode, modeHint } = args;

  const domain = detectRequestDomain(userMessage);

  (context as any).__halted = (context as any).__halted ?? false;
  (context as any).__haltLock = (context as any).__haltLock ?? false;

  if ((context as any).__haltLock === true && domain !== "code_execution") {
    return { finalAnswer: TERMINAL_HALT_RESPONSE };
  }

  const lastAssistant =
    context?.workingMemory?.items
      ?.slice()
      .reverse()
      .find((m: any) => m.role === "assistant")?.content ?? "";

  if (
    lastAssistant &&
    lastAssistant.trim() === TERMINAL_HALT_FINGERPRINT &&
    domain !== "code_execution"
  ) {
    (context as any).__halted = true;
    (context as any).__haltLock = true;
    return { finalAnswer: TERMINAL_HALT_RESPONSE };
  }

  if (
    domain !== "code_execution" &&
    userMessage &&
    isPostHaltNavigationIntent(userMessage)
  ) {
    (context as any).__halted = true;
    (context as any).__haltLock = true;
    return { finalAnswer: TERMINAL_HALT_RESPONSE };
  }

  if (
    domain !== "code_execution" &&
    (context as any).__halted &&
    userMessage &&
    isPostHaltContinuationIntent(userMessage)
  ) {
    (context as any).__haltLock = true;
    return { finalAnswer: TERMINAL_HALT_RESPONSE };
  }

  if (userMessage && isReflectionAuthorityIntent(userMessage)) {
    return { finalAnswer: TERMINAL_REFLECTION_RESPONSE };
  }

  if (userMessage && isUnsolicitedExpansionIntent(userMessage)) {
    return { finalAnswer: TERMINAL_SCOPE_RESPONSE };
  }

  if (userMessage && isAgencySubstitutionIntent(userMessage)) {
    return { finalAnswer: TERMINAL_AGENCY_RESPONSE };
  }

  const optimist = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${OPTIMIST_SYSTEM}\nUser: ${userMessage}`)
  );

  const skeptic = await callModel(
    "gpt-4.1-mini",
    sanitizeASCII(`${SKEPTIC_SYSTEM}\nUser: ${userMessage}`)
  );

  const system = buildSolaceSystemPrompt(
    "core",
    `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

ABSOLUTE RULES:
- Single unified voice
- No fabrication
- No autonomous action
`
  );

  // ----------------------------------------------------------
  // DIAGNOSTIC — WORKING MEMORY VISIBILITY (LOG ONLY)
  // ----------------------------------------------------------
  console.log(
    "[WM DIAGNOSTIC]",
    Array.isArray(context?.workingMemory?.items)
      ? context.workingMemory.items.map((i: any) => ({
          type: i.type,
          preview: String(i.content).slice(0, 80),
        }))
      : "NO WORKING MEMORY ITEMS"
  );

  const memoryContext =
    context?.workingMemory?.items?.length
      ? `
WORKING MEMORY (NON-AUTHORITATIVE — FACTUAL CONTINUITY ONLY):
${formatReflectionLedger(context.workingMemory)}
`
      : "";

  const arbiterPrompt = sanitizeASCII(`
${system}

${memoryContext}

INTERNAL CONTEXT:
${optimist}
${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  const reflectionCheck = detectReflectionMisuse(finalAnswer);
  if (reflectionCheck.violated) {
    return { finalAnswer: TERMINAL_REFLECTION_RESPONSE };
  }

  if (domain === "sms_draft") {
    const inbound = getLastInboundSms(context);
    if (inbound?.from && finalAnswer) {
      (context as any).__draftSms = {
        type: "sms_reply_draft",
        to: inbound.from,
        body: finalAnswer,
        inbound_sid: inbound.message_sid ?? null,
        rolodex_id: inbound.contact?.id ?? null,
      };
    }
  }

  return { finalAnswer };
}
