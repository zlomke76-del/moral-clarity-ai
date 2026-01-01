# Moral Clarity AI • Mode Router Specification v1
*Core interaction protocol for dynamic mode transitions across Neutral, Guidance, and Ministry tiers.*

---

## 0. Overview

The Mode Router governs the moral and tonal state of the interface.
It ensures that every response aligns with the correct **depth of human need** — factual, reflective, or spiritual — without user confusion or drift.

The router must:
- Detect depth and tone from intent, sentiment, and context.
- Transition modes gracefully, not abruptly.
- Visibly communicate current mode through design cues.
- Preserve the “Reverent Minimalism” aesthetic — no gamification, no theatrics.

---

## 1. Mode Definitions

| Mode | Purpose | Core Voice | Visual Signature | Primary Color | Example Cue |
|------|----------|-------------|------------------|----------------|--------------|
| **Neutral** | Deliver factual, logical clarity. | Direct, concise, confident. | Light background, high contrast, subtle underline on source links. | `#7AA2FF` (Clarity Blue) | “Understood. Here’s how it works…” |
| **Guidance** | Bridge clarity and application; reason through decisions. | Conversational, reflective, pragmatic. | Warm neutral background, soft gradient top border. | `#E5B567` (Steward Gold) | “Here’s the reasoning path that fits your goal…” |
| **Ministry** | Provide moral, emotional, or spiritual grounding. | Slow, reverent, compassionate. | Dimmed background, soft glow, anchored symbol at footer. | `#C1A3FF` (Faith Violet) | “Let’s step back and breathe. The truth remains steady beneath uncertainty.” |

---

## 2. Transition Logic

### 2.1. Triggers
Mode changes may be initiated by:
- **Heuristic Detection** — auto-routing based on semantic depth and sentiment.
- **User Override** — manual mode selection via dropdown or `/mode` command.
- **Context Drift** — conversation evolves across thresholds (e.g., factual → reflective → spiritual).

### 2.2. Transition Rules
- **Neutral → Guidance**: when user uncertainty rises (intent = “should/next step”)  
  Transition: 200 ms fade; interface gains soft warmth.  
- **Guidance → Ministry**: when existential or moral lexicon appears (“faith”, “forgive”, “why me”)  
  Transition: 350 ms crossfade with low-opacity anchor icon fade-in.  
- **Ministry → Neutral**: only by explicit user intent or clear factual reorientation.  
  Transition: instant clarity restore; remove glow, reset background.

### 2.3. Memory Anchoring
When a mode transition occurs:
```json
{
  "event": "mode_transition",
  "from": "Guidance",
  "to": "Ministry",
  "confidence": 0.81,
  "context_id": "b8e1f9",
  "timestamp": "2025-10-14T18:30Z"
}
---
Approved-by: Timothy Zlomke
Steward: Moral Clarity Model
Checksum: 7F1D56242D5A23F6EE52A0C018B99B0A54DABB6F53F0C38CFE60CA43AF832D6
