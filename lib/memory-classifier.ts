// lib/memory-classifier.ts
import "server-only";
import OpenAI from "openai";

export type MemoryClassificationLabel =
  | "Identity"
  | "Relationship"
  | "Origin"
  | "Preference"
  | "Profile"
  | "Habit"
  | "Emotional"
  | "Goal"
  | "Task"
  | "Note"
  | "Health"
  | "Interests"
  | "Boundary"
  | "Trigger"
  | "Episodic"
  | "DecisionContext"
  | "MoralValue"
  | "ProjectDetail"
  | "BusinessPartner"
  | "WorkspaceProfile"
  | "Financial"
  | "LocationContext"
  | "Other";

export type ClassificationResult = {
  provider: string;
  label: MemoryClassificationLabel;
  confidence: number;
  raw?: any;
};

/* ========= Solace Micro-Classifier (Rules + heuristics) ========= */

function microClassify(text: string): ClassificationResult {
  const t = text.toLowerCase();

  if (t.includes("goal") || t.includes("plan") || t.includes("objective"))
    return { provider: "micro", label: "Goal", confidence: 0.65 };

  if (t.includes("address") || t.includes("location"))
    return { provider: "micro", label: "LocationContext", confidence: 0.6 };

  if (t.includes("investor") || t.includes("partnership"))
    return { provider: "micro", label: "BusinessPartner", confidence: 0.65 };

  if (t.includes("money") || t.includes("salary") || t.includes("finance"))
    return { provider: "micro", label: "Financial", confidence: 0.6 };

  return { provider: "micro", label: "Other", confidence: 0.3 };
}

/* ========= OpenAI Classifier ========= */

const CLASSIFIER_MODEL = process.env.OPENAI_CLASSIFIER_MODEL || "gpt-4.1-mini";

async function classifyWithOpenAI(text: string): Promise<ClassificationResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const systemPrompt = `
You classify memory text into a single label.
Use the expanded label set.
Return ONLY JSON:
{ "label": "...", "confidence": 0.0 }
`;

  const resp = await client.responses.create({
    model: CLASSIFIER_MODEL,
    input: `${systemPrompt}\nTEXT:\n${text}`,
    max_output_tokens: 150,
    temperature: 0.0,
  });

  const raw = (resp as any).output_text ?? "";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { provider: "openai", label: "Other", confidence: 0.0, raw };
  }

  return {
    provider: "openai",
    label: parsed.label ?? "Other",
    confidence: parsed.confidence ?? 0,
    raw: parsed,
  };
}

/* ========= Fusion ========= */

export async function classifyMemoryText(text: string): Promise<ClassificationResult> {
  const micro = microClassify(text);
  const openai = await classifyWithOpenAI(text);

  // Fusion: prefer the more confident one
  return openai.confidence >= micro.confidence ? openai : micro;
}
