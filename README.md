Moral Clarity AI

Solace Governed Runtime Interface

This repository is the governed application layer for Solace, the Anchor AI of Moral Clarity AI.

It is not a generic chat backend.

It is a constrained execution interface that separates reasoning from action, enforces authority before side effects, and preserves memory discipline under pressure.

This project represents the runtime surface where:

Reasoning occurs.
Authority is checked.
Execution is either permitted or denied.
Memory is written under governance constraints.

It is a bridge between language models and deterministic enforcement.

Purpose

This repository exists as a governed reference implementation of the Solace runtime interface.

It demonstrates:

Fail closed execution semantics.
Authority anchored intent declaration.
Conversation scoped working memory with compaction.
Structured export and media gating.
Epistemic enforcement for structured evaluation modes.

It is not the full Moral Clarity AI system.
It is the application layer that enforces its operational constraints.

Core Invariants

The following properties are architectural, not optional.

Fail closed execution
No side effecting action executes without explicit authority approval.

Authority bypass for authorization queries
Questions such as "Am I authorized" never reach the language model. They are routed directly to the authority core.

Execution intent declaration
All side effecting actions declare structured intent including actor, system, action category, risk tier, and contextual metadata before evaluation.

Phantom execution prevention
The system scrubs execution language from model output and asserts that no action has occurred unless explicitly permitted and executed.

Memory tier separation
Working memory is session scoped and disposable.
Long term memory requires explicit authorization.
Reference data is not memory.

Constraint immutability
Constraints tighten under pressure.
Urgency does not justify override.
If action violates core governance, refusal is required.

These invariants are enforced in code, not documentation.

Architecture Overview

At a high level, this runtime coordinates five layers.

Persona and system constitution
The Solace persona defines identity boundaries, governance precedence, ontological limits, trajectory integrity rules, and coding mode contracts. These are compiled into the system prompt and treated as canonical system authority.

Context assembly
Conversation scoped working memory, memory packs, and reflection ledgers are assembled prior to model invocation. Context hydration is validated.

Hybrid reasoning pipeline
The language model is invoked only after authority sensitive routing is resolved. Attachments and vision consent are injected explicitly.

Authority layer
All execution intents are evaluated through structured authorization calls.
Authorization decisions may be PERMIT, DENY, or ESCALATE.
Execution does not occur without PERMIT.

Memory lifecycle
Working memory is persisted per conversation.
Rolling compaction summarizes older turns beyond configured thresholds.
Session isolation is enforced in demo mode.

Execution Surfaces

The runtime exposes controlled execution surfaces.

Image generation
Image requests declare a structured IMAGE_GENERATE action with explicit side effects.
Authority is evaluated before any external model call.
Demo mode blocks image generation.

Content export
Model output may embed explicit export markers.
Export triggers structured execution intent for file generation.
Authority is evaluated before writing to object storage or generating download links.

Newsroom mode
News responses are generated exclusively from a neutral digest view.
Exactly three stories are produced per invocation.
No prediction or analysis is permitted in newsroom mode.

EPPE-01 evaluation
Structured evaluations require explicit command invocation.
Implicit evaluation is rejected.
Output must conform to a validated schema before acceptance.

Authority queries
Authorization questions are routed directly to the authority core and do not pass through the language model.

Modes

Solace operates under domain modes.

Core
Neutral and grounded.

Founder
Architect level precision.

Guidance
Structured execution clarity.

Newsroom
Narrative neutral reporting constrained to digest data.

Ministry
Wisdom with explicit ontological deferral.

Optimist, Skeptic, Arbiter
Perspective lenses that adjust framing while preserving governance constraints.

Mode selection does not override governance precedence.

Demo Versus Studio Profiles

Execution profile is resolved per request.

Demo profile
Isolated conversation scope.
No shared conversation identifiers.
No side effecting execution.
Image generation blocked.

Studio profile
Full governed runtime behavior.
Authority checks active.
Memory persisted per authenticated user.

Isolation is a hard invariant.

Memory Model

Working memory
Stored per conversation and user.
Subject to rolling compaction after threshold.

Session compaction
Older turns are summarized and stored as structured memory artifacts.
Original working memory entries are deleted post compaction.

Long term memory
Requires explicit authorization and structured write path.

Memory structures are validated for hydration invariants during context assembly.

Security Model

Service role access is restricted to server side execution.
SSR authentication resolves authenticated user identity.
Conversation bootstrap occurs only when required.
Authority core URL must be explicitly configured.
Missing authority configuration results in denial, not fallback.

No implicit execution is permitted.

Environment Requirements

Required environment variables include:

NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_ANON_KEY
SOLACE_CORE_URL
SOLACE_API_KEY
NEXT_PUBLIC_BASE_URL

Authority calls will deny if SOLACE_CORE_URL is invalid or missing.

Quick Start

Install dependencies.

npm install

Run development server.

npm run dev

Ensure Supabase schemas for memory and newsroom digest are provisioned before use.

Authority core must be reachable for execution surfaces to function.

Non Goals

This repository does not:

Replace the authority core.
Relax constraints for convenience.
Provide probabilistic safety in place of deterministic enforcement.
Act as an emotional container or existential authority.

It is a governed interface, not a general purpose chatbot.

Governance

The governing principles for Moral Clarity AI are defined in the canonical Stewardship Agreement.

https://studio.moralclarity.ai/governance/stewardship-agreement

This runtime operates under those principles.

Constraint integrity supersedes optimization.

If action requires violation, inaction is permitted.
