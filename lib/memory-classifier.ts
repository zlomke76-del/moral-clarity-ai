// lib/memory-classifier.ts
import 'server-only';
import type OpenAI from 'openai';
import { getOpenAI } from '@/lib/openai';

export type MemoryClassificationLabel =
  | 'Identity'
  | 'Relationship'
  | 'Origin'
  | 'Preference'
  | 'Profile'
  | 'Habit'
  | 'Emotional'
  | 'Goal'
  | 'Task'
  | 'Note'
  | 'Health'
  | 'Interests'
  | 'Other';

export type ClassificationResult = {
  provider: string;
  label: MemoryClassificationLabel;
  confidence: number;
  raw?: any;
};

export interface MemoryClassifierProvider {
  name: string;
  classify(text: string): Promise<ClassificationResult>;
}

/* =================== OpenAI Provider =================== */

const CLASSIFIER_MODEL = process.env.OPENAI_CLASSIFIER_MODEL || 'gpt-4.1-mini';

async function getOpenAIClient(): Promise<OpenAI> {
  const client = await getOpenAI();
  return client;
}

const CLASSIFIER_SYSTEM_PROMPT = `
You are a memory classification engine for Moral Clarity AI.

You receive a single memory string (a short sentence or paragraph about a person, relationship, preference, fact, goal, or note).

Classify it into ONE of the following labels:

- Identity      (who the person is: name, roles, core identity details)
- Relationship  (family, friends, spouse, children, relational roles)
- Origin        (place of birth, hometown, cultural background, heritage)
- Preference    (likes/dislikes: foods, music, routines, styles, choices)
- Profile       (professional bio, resume, roles, career history)
- Habit         (repeated behaviors or routines)
- Emotional     (emotional state, values, deep feelings, hopes, fears)
- Goal          (explicit goals, dreams, objectives, plans)
- Task          (action items, reminders, to-do items)
- Note          (miscellaneous information, contextual notes)
- Health        (health-related info, conditions, medications, sensitivities)
- Interests     (hobbies, interests, recurring themes of fascination)
- Other         (if nothing else fits clearly)

Return ONLY a strict JSON object in this shape:

{
  "label": "Preference",
  "confidence": 0.87
}

- "label" MUST be exactly one of the labels above.
- "confidence" MUST be between 0 and 1.
- Do not include any other text before or after the JSON.
`.trim();

async function classifyWithOpenAI(text: string): Promise<ClassificationResult> {
  const client = await getOpenAIClient();

  const input = `${CLASSIFIER_SYSTEM_PROMPT}\n\nMEMORY:\n${text}`;

  const resp: any = await client.responses.create({
    model: CLASSIFIER_MODEL,
    input,
    max_output_tokens: 200,
    temperature: 0.0,
  });

  const rawText = (resp as any).output_text ?? String(resp?.output?.[0]?.content?.[0]?.text ?? '').trim();

  let parsed: { label?: string; confidence?: number } = {};
  try {
    parsed = JSON.parse(rawText);
  } catch {
    // Best-effort salvage if model wrapped JSON in something weird
    const match = rawText.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = {};
      }
    }
  }

  const label = (parsed.label as MemoryClassificationLabel) || 'Other';
  const confidence =
    typeof parsed.confidence === 'number' && parsed.confidence >= 0 && parsed.confidence <= 1
      ? parsed.confidence
      : 0;

  return {
    provider: 'openai',
    label,
    confidence,
    raw: {
      rawText,
      parsed,
      model: CLASSIFIER_MODEL,
    },
  };
}

export const OpenAIMemoryClassifier: MemoryClassifierProvider = {
  name: 'openai',
  classify: classifyWithOpenAI,
};

/* =================== Provider Registry & Router =================== */

/**
 * Provider registry. In the future you can add:
 * - SolaceMemoryClassifier
 * - DeepSeekMemoryClassifier
 * - AnthropicMemoryClassifier
 * etc.
 */
const PROVIDERS: MemoryClassifierProvider[] = [
  OpenAIMemoryClassifier,
  // Future:
  // SolaceMemoryClassifier,
  // DeepSeekMemoryClassifier,
];

const CONFIDENCE_THRESHOLD = 0.6;

/**
 * Classify a memory text using the provider registry.
 * - Tries providers in order.
 * - Returns the FIRST result with confidence >= threshold.
 * - If none reach threshold, returns the best available.
 * - On total failure, returns a safe "Other" label.
 */
export async function classifyMemoryText(text: string): Promise<ClassificationResult> {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return {
      provider: 'none',
      label: 'Other',
      confidence: 0,
      raw: { reason: 'empty text' },
    };
  }

  const results: ClassificationResult[] = [];

  for (const provider of PROVIDERS) {
    try {
      const res = await provider.classify(trimmed);
      results.push(res);

      if (res.confidence >= CONFIDENCE_THRESHOLD) {
        return res;
      }
    } catch (err: any) {
      results.push({
        provider: provider.name,
        label: 'Other',
        confidence: 0,
        raw: { error: String(err) },
      });
    }
  }

  if (results.length === 0) {
    return {
      provider: 'none',
      label: 'Other',
      confidence: 0,
      raw: { reason: 'no providers succeeded' },
    };
  }

  // Fallback: highest-confidence result, even if under threshold
  results.sort((a, b) => b.confidence - a.confidence);
  return results[0];
}
