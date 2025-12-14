//--------------------------------------------------------------
// NEWSROOM EXECUTOR — SINGLE PASS
// Strict neutral delivery
// Uses ONLY solace_news_digest_view.neutral_summary
//--------------------------------------------------------------

import { callModel } from "./model-router";
import { buildSolaceSystemPrompt } from "@/lib/solace/persona";

// --------------------------------------------------------------
// TYPES
// --------------------------------------------------------------
export type NewsDigestItem = {
  story_title: string;
  outlet: string;
  neutral_summary: string;
  created_at: string;
};

// --------------------------------------------------------------
// SYSTEM PROMPT (LOCKED)
// --------------------------------------------------------------
function buildNewsroomPrompt(items: NewsDigestItem[]) {
  const system = buildSolaceSystemPrompt("newsroom", `
OUTPUT CONTRACT (MANDATORY):

- Produce EXACTLY three stories.
- Each story must be between 350 and 450 words.
- Narrative prose only.
- One topic per story.
- No bullet points.
- No summaries, conclusions, or meta commentary.
- No trend analysis.
- No comparisons across stories.
- No opinion or framing language.

SOURCE RULES:

- Use ONLY the provided neutral summaries.
- Do NOT infer motive, intent, or moral judgment.
- Do NOT aggregate multiple stories into one.
- If there is insufficient material for three full stories, explicitly state that and stop.
`);

  const digestBlock = items
    .slice(0, 3)
    .map(
      (n, i) => `
STORY ${i + 1}
TITLE: ${n.story_title}
OUTLET: ${n.outlet}
NEUTRAL SUMMARY:
${n.neutral_summary}
`
    )
    .join("\n");

  return `
${system}

------------------------------------------------------------
TODAY'S NEUTRAL NEWS DIGEST
------------------------------------------------------------
${digestBlock}
`;
}

// --------------------------------------------------------------
// EXECUTOR
// --------------------------------------------------------------
export async function runNewsroomExecutor(
  newsDigest: NewsDigestItem[]
): Promise<string> {
  if (!Array.isArray(newsDigest) || newsDigest.length < 3) {
    return "There is insufficient verified neutral news content to produce a full daily briefing.";
  }

  const prompt = buildNewsroomPrompt(newsDigest);

  const response = await callModel("gpt-4.1", prompt);

  return response;
}
