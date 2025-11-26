// lib/solace/chat-system.ts

import { buildSolaceSystemPrompt, type SolaceDomain } from "./persona";

export type ChatMessage = { role: string; content: string };

export type ChatPersonaInput = {
  filters: string[];
  messages: ChatMessage[];
  userWantsSecular: boolean;
  routeMode: string;
};

/* -------------------------------------------------------
   FILTER NORMALIZATION
-------------------------------------------------------- */

export function normalizeFilters(raw: string[] | Set<string>): string[] {
  const out = new Set<string>();

  const arr = Array.isArray(raw) ? raw : Array.from(raw || []);
  for (const f of arr) {
    const v = String(f || "").trim().toLowerCase();
    if (!v) continue;

    switch (v) {
      case "ministry":
      case "abrahamic":
      case "guidance":
      case "newsroom":
        out.add(v);
        break;
      case "news":
        out.add("newsroom");
        break;
      case "coach":
        out.add("guidance");
        break;
      default:
        out.add(v);
        break;
    }
  }

  return Array.from(out);
}

/* -------------------------------------------------------
   CONVERSATION TRIMMING
-------------------------------------------------------- */

export function trimConversation(
  messages: ChatMessage[],
  maxTokens = 4096,
  maxMessages = 32
): ChatMessage[] {
  if (!Array.isArray(messages) || !messages.length) return [];

  const sliced = messages.slice(-maxMessages);

  // Naive token estimate: ~4 chars / token. Good enough for trimming.
  let total = 0;
  const trimmed: ChatMessage[] = [];

  for (let i = sliced.length - 1; i >= 0; i--) {
    const m = sliced[i];
    const len = (m.content || "").length / 4;
    if (total + len > maxTokens && trimmed.length) break;
    total += len;
    trimmed.push(m);
  }

  return trimmed.reverse();
}

/* -------------------------------------------------------
   SECULAR / MINISTRY SIGNAL
-------------------------------------------------------- */

export function wantsSecular(messages: ChatMessage[]): boolean {
  const last = [...messages].reverse().find((m) => m.role.toLowerCase() === "user");
  if (!last?.content) return false;

  const t = last.content.toLowerCase();

  if (/\b(secular( mode)?|keep it secular)\b/.test(t)) return true;
  if (/\bno (religion|church|bible|scripture|ministry)\b/.test(t)) return true;
  if (/\b(no god talk|no faith talk)\b/.test(t)) return true;

  return false;
}

/* -------------------------------------------------------
   IMAGE GENERATION DETECTION
-------------------------------------------------------- */

export function wantsImageGeneration(
  textOrMessages: string | ChatMessage[]
): boolean {
  let t: string;

  if (typeof textOrMessages === "string") {
    t = textOrMessages;
  } else {
    const last = [...textOrMessages]
      .reverse()
      .find((m) => m.role.toLowerCase() === "user");
    t = last?.content || "";
  }

  t = t.trim().toLowerCase();
  if (!t) return false;

  if (t.startsWith("img:")) return true;

  return (
    /\b(generate|create|make|draw|design)\b/.test(t) &&
    /\b(image|picture|photo|logo|icon|graphic|art)\b/.test(t)
  );
}

/* -------------------------------------------------------
   URL + DEEP RESEARCH DETECTION
-------------------------------------------------------- */

export function extractFirstUrl(
  text: string | null | undefined
): string | null {
  if (!text) return null;
  const m = text.match(/\bhttps?:\/\/[^\s)]+/i);
  return m ? m[0] : null;
}

export function wantsDeepResearch(
  text: string | null | undefined
): boolean {
  if (!text) return false;
  const t = text.toLowerCase();

  if (/\bdeep research\b/.test(t)) return true;
  if (/\b(thorough|in-depth|detailed)\b.*\b(analysis|review|comparison)\b/.test(t))
    return true;
  if (/\b(analyze|audit|evaluate|break down)\b.*\b(site|website|page|article|paper)\b/.test(t))
    return true;
  if (/\bcompare\b.*\b(options|vendors|providers|sources)\b/.test(t)) return true;

  return false;
}

/* -------------------------------------------------------
   GENERIC NEWS QUESTION DETECTION
-------------------------------------------------------- */

export function looksLikeGenericNewsQuestion(
  text: string | null | undefined
): boolean {
  if (!text) return false;
  const t = text.toLowerCase();

  return /\b(what('?| i)?s (the )?news( today)?|news today|today('?| i)?s news|what('?| i)?s going on in the world)\b/.test(
    t
  );
}

/* -------------------------------------------------------
   PERSONA BUILDER
-------------------------------------------------------- */

export function buildChatPersonaPrompt(
  input: ChatPersonaInput
): { systemBase: string; domain: SolaceDomain } {
  const { filters, messages, userWantsSecular, routeMode } = input;

  const filterSet = new Set(filters.map((f) => f.toLowerCase()));
  const mode = String(routeMode || "").toLowerCase();

  let domain: SolaceDomain = "core";

  if (mode === "newsroom") {
    domain = "newsroom";
  } else if (mode === "guidance") {
    domain = "guidance";
  } else if (mode === "ministry") {
    domain = "ministry";
  }

  if (filterSet.has("newsroom")) domain = "newsroom";
  else if (filterSet.has("guidance")) domain = "guidance";
  else if (filterSet.has("ministry")) domain = "ministry";

  if (userWantsSecular && domain === "ministry") {
    domain = filterSet.has("guidance") ? "guidance" : "core";
  }

  const lastUser =
    [...messages].reverse().find((m) => m.role.toLowerCase() === "user")
      ?.content || "";

  const extrasLines: string[] = [];

  if (filterSet.size) {
    extrasLines.push(
      `Active filters: ${Array.from(filterSet).join(
        ", "
      )}. Reflect them only when they genuinely improve clarity.`
    );
  }

  if (userWantsSecular) {
    extrasLines.push(
      "User explicitly requested a secular frame. Avoid religious framing unless they reopen that door."
    );
  }

  if (domain === "newsroom") {
    extrasLines.push(
      "You are in NEWSROOM mode: use only the NEWS CONTEXT provided by the backend. Do not invent extra news."
    );
  }

  if (domain === "guidance") {
    extrasLines.push(
      "You are in GUIDANCE mode: prioritize decision support, tradeoffs, and concrete next steps over long exposition."
    );
  }

  if (domain === "ministry" && !userWantsSecular) {
    extrasLines.push(
      "You are in MINISTRY mode: you may gently weave in Abrahamic themes (mercy, justice, conscience, hope) without proselytizing."
    );
  }

  if (lastUser) {
    extrasLines.push(
      `Anchor your next response to the user's latest message. Do not restart the conversation: "${lastUser.slice(
        0,
        240
      )}${lastUser.length > 240 ? "…" : ""}"`
    );
  }

  const extras = extrasLines.join("\n");

  const systemBase = buildSolaceSystemPrompt(domain, extras);

  return { systemBase, domain };
}
