import type OpenAI from "openai";
import { getOpenAI } from "./openai";

export type OrchestratorInput = {
  personaName: string;
  personaSystemPrompt: string;
  personaStyle: string;
  boundaries: string;
  faithLensPrompt: string;
  userMessage: string;
  model?: string;
  temperature?: number;
};

export async function answerOrchestrator(input: OrchestratorInput) {
  const {
    personaName,
    personaSystemPrompt,
    personaStyle,
    boundaries,
    faithLensPrompt,
    userMessage,
    model = "gpt-4o-mini",
    temperature = 0.3,
  } = input;

  const openai = await getOpenAI();

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: `[PERSONA: ${personaName}]\n${personaSystemPrompt}\nStyle: ${personaStyle}` },
    { role: "system", content: boundaries },
    { role: "system", content: faithLensPrompt },
    { role: "user", content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model,
    temperature,
    messages,
  });

  const answer = completion.choices?.[0]?.message?.content ?? "";
  return { answer };
}
