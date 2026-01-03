// --------------------------------------------------------------
// HYBRID PIPELINE — REASONING ONLY (SESSION-AWARE)
// Optimist + Skeptic are INTERNAL
// Arbiter emits ONE unified Solace voice
// FACTS SUPERSEDE ALL
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// ASCII SANITIZER
// --------------------------------------------------------------
function sanitizeASCII(input: string): string {
  if (!input) return "";
  return input.replace(/[^\x00-\xFF]/g, "?");
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
// FORMATTERS
// --------------------------------------------------------------
function formatWorkingMemory(context: any): string {
  const wm = context?.workingMemory?.items ?? [];

  if (!Array.isArray(wm) || wm.length === 0) {
    return `WORKING MEMORY:\nNone.\n`;
  }

  return `
WORKING MEMORY (SESSION-SCOPED, NON-DURABLE):
${wm.map((m: any) => `- (${m.role}) ${m.content}`).join("\n")}

RULES:
- Working memory MAY influence reasoning.
- Working memory MUST NOT override factual memory.
`;
}

function formatFactualMemory(context: any): string {
  const facts = context?.memoryPack?.facts ?? [];

  if (!facts.length) {
    return `FACTUAL MEMORY:\nNone recorded.\n`;
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

RULES:
- Contacts MUST resolve from this list only.
`;
}

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

  console.log("[DIAG-HYBRID]", {
    facts: context?.memoryPack?.facts?.length ?? 0,
    wm: context?.workingMemory?.items?.length ?? 0,
    rolodex: context?.rolodex?.length ?? 0,
  });

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

  const arbiterPrompt = sanitizeASCII(`
${system}

${formatFactualMemory(context)}
${formatRolodex(context)}
${formatWorkingMemory(context)}

INTERNAL CONTEXT:
${optimist}
${skeptic}

USER MESSAGE:
${userMessage}
`);

  const finalAnswer = await callModel("gpt-4.1", arbiterPrompt);

  // ----------------------------------------------------------
  // SMS DRAFT CREATION (NO STORAGE HERE)
  // ----------------------------------------------------------
  if (userMessage && isSmsDraftIntent(userMessage)) {
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
