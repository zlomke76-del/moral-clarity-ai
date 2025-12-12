// lib/memory-classifier.ts
import "server-only";
import OpenAI from "openai";

/* ========= Types ========= */

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
  provider: "micro" | "openai" | "system";
  label: MemoryClassificationLabel;
  confidence: number; // 0–1
  raw?: any;
};

/* ========= Guardrails ========= */

function validateInput(text: string): ClassificationResult | null {
  if (!text || typeof text !== "string") {
    return {
      provider: "system",
      label: "Other",
      confidence: 0,
      raw: "Invalid input",
    };
  }

  const trimmed = text.trim();
  if (trimmed.length < 5) {
    return {
      provider: "system",
      label: "Other",
      confidence: 0.1,
      raw: "Input too short to classify",
    };
  }

  return null;
}

/* ========= Micro-Classifier ========= */

const LABEL_TERMS: Record<MemoryClassificationLabel, string[]> = {
  Goal: ["goal", "plan", "objective", "target", "aim", "aspiration"],
  Task: ["todo", "task", "remind", "follow up", "action item"],
  LocationContext: ["address", "location", "where", "based in", "live in"],
  BusinessPartner: ["investor", "partner", "cofounder", "collaborator"],
  Financial: ["money", "salary", "revenue", "budget", "cost", "finance"],
  Emotional: ["feel", "felt", "emotion", "anxious", "happy", "angry"],
  Preference: ["prefer", "like", "dislike", "favorite"],
  Habit: ["always", "usually", "often", "routine", "habit"],
  Health: ["health", "medical", "diagnosis", "condition", "allergy"],
  Boundary: ["do not", "never", "boundary", "limit", "not comfortable"],
  MoralValue: ["believe", "value", "ethic", "principle", "moral"],
  ProjectDetail: ["project", "build", "ship", "launch", "feature"],
  WorkspaceProfile: ["workspace", "team", "org", "organization"],
  Identity: ["i am", "my name is", "identity"],
  Relationship: ["wife", "husband", "partner", "friend", "family"],
  Episodic: ["yesterday", "last week", "earlier today", "when i"],
  DecisionContext: ["because", "so that", "decision", "reason"],
  Interests: ["interested in", "hobby", "enjoy", "passion"],
  Trigger: ["trigger", "sets me off", "react when"],
  Origin: ["from", "born", "grew up"],
  Profile: [],
  Note: [],
  Other: [],
};

function microClassify(text: string): ClassificationResult {
  const t = text.toLowerCase();

  for (const [label, terms] of Object.entries(LABEL_TERMS)) {
    if (!terms.length) continue;
    if (terms.some(term => t.includes(term))) {
      return {
        provider: "micro",
        label: label as MemoryClassificationLabel,
        confidence: 0.65,
      };
    }
  }

  return { provider: "micro", label: "Other", confidence: 0.3 };
}

/* ========= OpenAI Classifier ========= */

const CLASSIFIER_MODEL =
  process.env.OPENAI_CLASSIFIER_MODEL || "gpt-4.1-mini";

const VALID_LABELS = Object.keys(LABEL_TERMS);

async function classifyWithOpenAI(
  text: string
): Promise<ClassificationResult> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const systemPrompt = `
You are a memory classifier for an AI system.
Choose ONE label from the allowed list.

Allowed labels:
${VALID_LABELS.join(", ")}

Return ONLY valid JSON in this format:
{ "label": "<label>", "confidence": <number between 0 and 1> }
`;

  try {
    const resp = await client.responses.create({
      model: CLASSIFIER_MODEL,
      input: `${systemPrompt}\nTEXT:\n${text}`,
      temperature: 0,
      max_output_tokens: 120,
    });

    const rawText = (resp as any).output_text ?? "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!VALID_LABELS.includes(parsed.label)) {
      throw new Error("Invalid label");
    }

    return {
      provider: "openai",
      label: parsed.label,
      confidence: Number(parsed.confidence) || 0,
      raw: parsed,
    };
  } catch (err) {
    return {
      provider: "openai",
      label: "Other",
      confidence: 0,
      raw: String(err),
    };
  }
}

/* ========= Fusion Logic ========= */

function fuseResults(
  micro: ClassificationResult,
  openai: ClassificationResult
): ClassificationResult {
  // Agreement boost
  if (
    micro.label === openai.label &&
    micro.label !== "Other"
  ) {
    return {
      provider: "openai",
      label: openai.label,
      confidence: Math.min(
        0.95,
        Math.max(micro.confidence, openai.confidence) + 0.1
      ),
      raw: { micro, openai },
    };
  }

  // Prefer stronger signal
  if (openai.confidence >= micro.confidence) return openai;
  return micro;
}

/* ========= Public API ========= */

export async function classifyMemoryText(
  text: string
): Promise<ClassificationResult> {
  const invalid = validateInput(text);
  if (invalid) return invalid;

  const micro = microClassify(text);
  const openai = await classifyWithOpenAI(text);

  const fused = fuseResults(micro, openai);

  // Low-confidence safety fallback
  if (fused.confidence < 0.25) {
    return {
      provider: "system",
      label: "Other",
      confidence: fused.confidence,
      raw: fused,
    };
  }

  return fused;
}
