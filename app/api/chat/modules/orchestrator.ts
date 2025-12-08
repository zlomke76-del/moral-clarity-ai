// app/api/chat/modules/orchestrator.ts

import { buildSystemBlock, assemblePrompt } from "./assemble";
// import { openAI } from "./openai";  // ❌ REMOVE — no such file
// If no wrapper exists, we’ll DIAG directly around fetch()

type OrchestratorArgs = {
  userMessage: string;
  context: any;
  history: any[];
  ministryMode: boolean;
  modeHint: string;
  founderMode: boolean;
  canonicalUserKey: string | null;
};

export async function orchestrateSolaceResponse(args: OrchestratorArgs) {
  const {
    userMessage,
    context,
    history,
    ministryMode,
    modeHint,
    founderMode,
    canonicalUserKey,
  } = args;

  console.log("---------------------------------------------------");
  console.log("[DIAG-OX] ENTER orchestrator");
  console.log("[DIAG-OX] modeHint:", modeHint);
  console.log("[DIAG-OX] founderMode:", founderMode);
  console.log("[DIAG-OX] ministryMode:", ministryMode);
  console.log("[DIAG-OX] canonicalUserKey:", canonicalUserKey);
  console.log("[DIAG-OX] userMessage:", userMessage);
  console.log("---------------------------------------------------");

  // Build system block + user blocks used in multiple branches
  const systemBlock = buildSystemBlock("arbiter", "");
  const userBlocks = assemblePrompt(context, history, userMessage);
  const baseBlocks = [systemBlock, ...userBlocks];

  console.log("[DIAG-OX] Assembled baseBlocks length:", baseBlocks.length);

  // Utility wrapper to measure and DIAG OpenAI calls
  async function callWithDiag(label: string, model: string, messages: any[]) {
    console.log(`\n[DIAG-OA] CALL START → ${label}`);
    console.log(`[DIAG-OA] Model: ${model}`);
    console.log(`[DIAG-OA] Blocks count: ${messages.length}`);

    const started = Date.now();

    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          input: messages,
        }),
      });

      const ms = Date.now() - started;
      console.log(`[DIAG-OA] Response time: ${ms}ms`);

      if (res.status === 429) {
        console.warn(`[DIAG-OA] 429 RATE LIMIT in ${label}`);
      }
      if (!res.ok) {
        const errText = await res.text();
        console.error(`[DIAG-OA] ERROR in ${label}:`, res.status, errText);
        return null;
      }

      const json = await res.json();
      const text =
        json?.output?.[0]?.content?.[0]?.text ??
        json?.choices?.[0]?.message?.content ??
        null;

      console.log(`[DIAG-OA] Parsed text for ${label}:`, text?.slice(0, 200));
      return text;
    } catch (err: any) {
      console.error(`[DIAG-OA] FETCH FAILURE in ${label}:`, err.message);
      return null;
    }
  }

  //-------------------------------------------------------------
  // BRANCH: FOUNDER MODE — high-context strategy
  //-------------------------------------------------------------
  if (founderMode) {
    console.log("\n[DIAG-OF] Founder mode active.");
    const label = "Founder Arbiter Reply";
    const reply = await callWithDiag(label, "gpt-4.1", baseBlocks);

    console.log("[DIAG-OF] Founder reply:", reply);
    return reply;
  }

  //-------------------------------------------------------------
  // BRANCH: CREATE MODE
  //-------------------------------------------------------------
  if (modeHint === "Create") {
    console.log("\n[DIAG-OC] Create mode active.");

    const createBlocks = [
      ...baseBlocks,
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "You are in CREATE mode. Be generative, inventive, but grounded.",
          },
        ],
      },
    ];

    const reply = await callWithDiag("Create-Primary", "gpt-4.1", createBlocks);
    console.log("[DIAG-OC] Create reply:", reply);
    return reply;
  }

  //-------------------------------------------------------------
  // BRANCH: RED TEAM MODE
  //-------------------------------------------------------------
  if (modeHint === "Red Team") {
    console.log("\n[DIAG-OR] Red Team mode active.");

    const rtBlocks = [
      ...baseBlocks,
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are in RED TEAM mode. Provide adversarial critique, attack assumptions, expose flaws.",
          },
        ],
      },
    ];

    const reply = await callWithDiag("RedTeam-Primary", "gpt-4.1", rtBlocks);
    console.log("[DIAG-OR] Red team reply:", reply);
    return reply;
  }

  //-------------------------------------------------------------
  // BRANCH: NEXT STEPS MODE
  //-------------------------------------------------------------
  if (modeHint === "Next Steps") {
    console.log("\n[DIAG-ON] Next Steps mode active.");

    const nsBlocks = [
      ...baseBlocks,
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are in NEXT STEPS mode. Provide actionable next steps, prioritization, and clarity.",
          },
        ],
      },
    ];

    const reply = await callWithDiag("NextSteps-Primary", "gpt-4.1", nsBlocks);
    console.log("[DIAG-ON] Next Steps reply:", reply);
    return reply;
  }

  //-------------------------------------------------------------
  // DEFAULT FALLBACK (if somehow no mode matched)
  //-------------------------------------------------------------
  console.warn("[DIAG-OX] WARNING: Orchestrator reached fallback branch.");
  const fallback = await callWithDiag("Fallback", "gpt-4.1", baseBlocks);

  console.log("[DIAG-OX] Fallback reply:", fallback);
  return fallback;
}

