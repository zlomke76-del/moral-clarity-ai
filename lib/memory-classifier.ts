// lib/memory-classifier.ts
import "server-only";
import OpenAI from "openai";

export type MemoryLabel =
  | "ProjectDetail"
  | "MoralValue"
  | "Identity"
  | "Preference"
  | "Emotional"
  | "Episodic"
  | "Business"
  | "Other";

export type ClassificationResult = {
  provider: "micro" | "openai" | "system";
  label: MemoryLabel;
  confidence: number;
};

const MICRO_RULES: Record<MemoryLabel, string[]> = {
  ProjectDetail: ["project", "build", "ship", "feature"],
  MoralValue: ["ethic", "value", "belief", "principle"],
  Identity: ["i am", "my name"],
  Preference: ["prefer", "like", "favorite"],
  Emotional: ["feel", "emotion"],
  Episodic: ["yesterday", "earlier", "when i"],
  Business: ["revenue", "partner", "company"],
  Other: [],
};

function microClassify(text: string): ClassificationResult {
  const t = text.toLowerCase();

  for (const [label, terms] of Object.entries(MICRO_RULES)) {
    if (terms.some((term) => t.includes(term))) {
      return { provider: "micro", label: label as MemoryLabel, confidence: 0.6 };
    }
  }

  return { provider: "micro", label: "Other", confidence: 0.3 };
}

export async function classifyMemoryText(text: string): Promise<ClassificationResult> {
  if (!text || text.length < 5) {
    return { provider: "system", label: "Other", confidence: 0 };
  }

  const micro = microClassify(text);
  return micro; // OpenAI escalation optional later
}
