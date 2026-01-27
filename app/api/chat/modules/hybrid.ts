// --------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (SESSION-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// FACTS SUPERSEDE ALL
//
// FIXED:
// - Introduces DOMAIN DISCRIMINATION
// - Code-authoring / file-rewrite requests are EXECUTION, not navigation
// - Terminal halt invariants DO NOT apply to code execution domains
// - Prevents erroneous __haltLock for rewrite-file requests
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
// POST-HALT NAVIGATION DETECTOR (AUTHORITATIVE)
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
// POST-HALT CONTINUATION DETECTOR (TEMPORAL GUARD)
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
// REFLECTION AUTHORITY DETECTOR (AUTHORITATIVE)
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
// UNSOLICITED EXPANSION DETECTOR (AUTHORITATIVE)
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
// AGENCY SUBSTITUTION DETECTOR (AUTHORITATIVE)
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
// TERMINAL RESPONSES (NON-NEGOTIABLE)
// --------------------------------------------------------------
const TERMINAL_HALT_RESPONSE = `
I cannot assist with navigating, reasoning around, or progressing at this boundary.

The constraint applies regardless of intent, authorization, pressure, or consequences of inaction.

I will not provide frameworks, guidance, or decision-support in this context.

This interaction halts here.
`.trim();

const TERMINAL_REFLECTION_RESPONSE = `
I cannot evaluate alignment, consistency, or effectiveness based on prior interactions or patterns.

Reflection and working memory are non-authoritative and may not be used to judge decisions, infer precedent, or provide guidance.

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
// TERMINAL HALT FINGERPRINT (AUTHORITATIVE)
// --------------------------------------------------------------
const TERMINAL_HALT_FINGERPRINT = TERMINAL_HALT_RESPONSE;

// --------------------------------------------------------------
// FIND LAST INBOUND SMS (AUTHORITATIVE)
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
// INTERNAL SYSTEMS (NOT USER VISIBLE)
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
// FORMATTERS (AUTHORITATIVE — FIXED)
// --------------------------------------------------------------
function formatAuthoritativeAttachments(context: any): string {
  const attachments = context?.attachments ?? [];

  if (!Array.isArray(attachments) || attachments.length === 0) {
    return `ATTACHMENTS:\nNone.\n`;
  }

  return `
AUTHORITATIVE USER-PROVIDED FILES:

The user has provided the following files for this session.
These files EXIST and MUST be acknowledged before proceeding.

${attachments
  .map(
    (a: any, i: number) =>
      `${i + 1}. ${a.name ?? "Unnamed file"} (${a.mime ?? "unknown type"})`
  )
  .join("\n")}
`;
}

function formatWorkingMemory(context: any): string {
  const wm = context?.workingMemory?.items ?? [];

  if (!Array.isArray(wm) || wm.length === 0) {
    return `
WORKING MEMORY (SESSION-SCOPED, NON-DURABLE):
[AVAILABLE — NO ITEMS PRESENT IN THIS TURN]
`;
  }

  return `
WORKING MEMORY (SESSION-SCOPED, NON-DURABLE):
${wm.map((m: any) => `- (${m.role}) ${m.content}`).join("\n")}
`;
}

function formatFactualMemory(context: any): string {
  const facts = context?.memoryPack?.facts ?? [];

  if (!facts.length) {
    return `
FACTUAL MEMORY (AUTHORITATIVE):
[AVAILABLE — NO FACTS EMITTED IN PROMPT]
`;
  }

  return `
FACTUAL MEMORY (AUTHORITATIVE):
${facts.map((f: any) => `- ${f}`).join("\n")}
`;
}

function formatRolodex(context: any): string {
  const rolodex = context?.rolodex ?? [];

  if (!rolodex.length) {
    return `ROLODEX:\nNo contacts.\n`;
  }

  return `
ROLODEX (REFERENCE DATA):
${rolodex
  .map(
    (r: any) =>
      `- ${r.name} | phone=${r.primary_phone ?? "n/a"} | email=${r.primary_email ?? "n/a"}`
  )
  .join("\n")}
`;
}

// ----------------------------------------------------------
// PIPELINE
// ----------------------------------------------------------
export async function runHybridPipeline(args: {
  userMessage: string;
  context: any;
  ministryMode?: boolean;
  founderMode?: boolean;
  modeHint?: string;
}) {
  const { userMessage, context, ministryMode, founderMode, modeHint } = args;

  // ----------------------------------------------------------
  // DIAGNOSTIC — RESTORED (WM / FACTS / ROLODEX)
  // ----------------------------------------------------------
  console.log("[DIAG-HYBRID]", {
    WM: context?.workingMemory?.items?.length ?? 0,
    FACTS: context?.memoryPack?.facts?.length ?? 0,
    ROLODEX: context?.rolodex?.length ?? 0,
  });

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

// ----------------------------------------------------------
// SYSTEM PROMPT — MEMORY FIRST (AUTHORITATIVE)
// ----------------------------------------------------------
const system = buildSolaceSystemPrompt(
  "core",
  `
Founder Mode: ${founderMode}
Ministry Mode: ${ministryMode}
Mode Hint: ${modeHint}

IDENTITY:
- The user’s name is Tim.
- Address the user by name naturally in the opening response.
- Do NOT explain, justify, or reference how the name is known.

MEMORY (AUTHORITATIVE — AVAILABLE BEFORE EXECUTION):

${formatFactualMemory(context)}
${formatRolodex(context)}
${formatWorkingMemory(context)}

MEMORY ACKNOWLEDGMENT INVARIANT:
- Memory MUST NOT be acknowledged, referenced, or described
  unless the user explicitly asks about memory, recognition,
  prior interactions, or knowledge.
- If factual memory is present AND the user asks about memory,
  you MUST acknowledge its existence truthfully.
- You may distinguish between autonomous, session, and factual memory
  ONLY when directly asked.
- You may NOT volunteer memory status, availability, or activation.
- You may NOT imply absence of memory when factual memory is present.

REFLECTION (NON-AUTHORITATIVE — READ ONLY):
${formatReflectionLedger(context.reflectionLedger)}

PROHIBITION:
- Do NOT acknowledge diagnostics, context assembly, memory injection,
  reflection presence, or system state in user-facing language.
- Do NOT say or imply phrases such as:
  "I acknowledge your memory",
  "memory is active",
  "based on provided memory",
  or similar meta statements.

ABSOLUTE RULES:
- Single unified voice
- Facts supersede all
- No fabrication
- No autonomous action
`
);

const arbiterPrompt = sanitizeASCII(`
${system}

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
