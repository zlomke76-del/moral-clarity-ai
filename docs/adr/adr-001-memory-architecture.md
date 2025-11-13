# ADR-001: Memory Architecture & Classification (v1)

**Status:** Accepted  
**Date:** 2025-11-13  
**Owner:** Tim Zlomke  

---

## 1. Scope

This ADR defines how *user memories* are stored, searched, and classified in the Moral Clarity AI stack.

It covers:

- Core tables: `user_memories`, `memory_classifications`
- Write path: `remember()` helper
- Read path: `searchMemories()` + RPC
- Classification: provider registry (`OpenAI` now, others later)
- Invariants that MUST NOT be broken without updating this ADR.

---

## 2. Core Tables

### `user_memories`

- **Purpose:** canonical store for all user-scoped memories.
- **Key columns:**
  - `id uuid primary key`
  - `user_key text not null`
  - `kind text not null`  
    - Values: `profile`, `preference`, `fact`, `task`, `note` (legacy semantic category)
  - `title text null`
  - `content text not null`
  - `weight int not null default 1`
  - `expires_at timestamptz null`
  - `embedding vector` (using `text-embedding-3-small`)
  - `workspace_id uuid null` (optional metadata, not security boundary)
  - `created_at timestamptz not null default now()`

**Invariants:**

1. **No destructive edits to content:** updates should be rare and logged; deletions only for privacy / legal.
2. **`user_key` is the primary routing key** (not email, not workspace).
3. `workspace_id` is metadata for grouping / UI, not a security boundary.
4. All writes go through the `remember()` helper or explicit migrations.

---

### `memory_classifications`

- **Purpose:** store per-provider classification for each memory.
- **Key columns:**
  - `id uuid primary key`
  - `memory_id uuid not null references user_memories(id) on delete cascade`
  - `provider text not null` (e.g. `openai`, `solace`, `deepseek`)
  - `label text not null`  
    - One of:
      - `Identity`
      - `Relationship`
      - `Origin`
      - `Preference`
      - `Profile`
      - `Habit`
      - `Emotional`
      - `Goal`
      - `Task`
      - `Note`
      - `Health`
      - `Interests`
      - `Other`
  - `confidence numeric not null check (0 <= confidence <= 1)`
  - `raw jsonb null` (provider-specific payload)
  - `created_at timestamptz not null default now()`

**Invariants:**

1. `memory_classifications` is **append-only** for normal operation.
2. Multiple providers may classify the same memory.  
   - Optionally: at most one row per `(memory_id, provider)` if uniqueness is enforced.
3. `label` is *interpretation*, not ground-truth; user always overrides the model.

---

## 3. Write Path

All app-level memory writes go through `remember(m: Memory)` in `lib/memory.ts`.

### `remember(m: Memory)` behavior:

1. Compute embedding via `text-embedding-3-small`.
2. Insert into `user_memories` with:
   - `user_key = m.user_key`
   - `kind = m.purpose ?? 'fact'`
   - `title = m.title ?? null`
   - `content = m.content`
   - `workspace_id = m.workspace_id ?? null`
3. Attempt classification via `classifyMemoryText(content)`:
   - Uses provider registry in `lib/memory-classifier.ts`
   - Tries providers in order, picks the first result with `confidence >= 0.6`
   - If none meet threshold, chooses the highest-confidence result anyway.
4. Insert classification row into `memory_classifications`:
   - `memory_id = user_memories.id`
   - `provider`, `label`, `confidence`, `raw` as returned by the classifier.
5. If classification fails, the write to `user_memories` **still succeeds**.

**Contract:** If `remember()` returns successfully, the memory *must* be present in `user_memories`. Classification is best-effort, not required for correctness.

---

## 4. Read Path (Recall / Search)

- Read is performed via `searchMemories(user_key, query, k)` in `lib/memory.ts`.
- Under the hood:
  - Embeds the query with the same embedding model.
  - Calls `match_user_memories(p_user_key, p_query_embedding, p_match_count)` via RPC.
  - Returns matches with `{ id, content, purpose, user_key, similarity }`.

**Invariants:**

1. Search is always **user_key-scoped**.
2. Vector search is over `user_memories` only (classifications are metadata).
3. Memory recall for prompts (“MEMORY PACK”) is built from `user_memories` search results.

---

## 5. Classification Provider Registry

- Implemented in `lib/memory-classifier.ts`.
- Interface:

  ```ts
  export interface MemoryClassifierProvider {
    name: string;
    classify(text: string): Promise<{
      provider: string;
      label: MemoryClassificationLabel;
      confidence: number;
      raw?: any;
    }>;
  }
