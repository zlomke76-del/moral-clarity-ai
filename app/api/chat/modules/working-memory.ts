// ------------------------------------------------------------
// Working Memory Store — Conversation Scoped
// Phase 5 (AUTHORITATIVE)
// ------------------------------------------------------------
// - In-memory only
// - Scoped by conversationId (sessionId)
// - Explicit writes only
// - No automatic flushing
// ------------------------------------------------------------

export type WorkingMemoryRole = "user" | "assistant";

export type WorkingMemoryItem = {
  role: WorkingMemoryRole;
  content: string;
  created_at: string;
};

// ------------------------------------------------------------
// Global WM Store (INTENTIONAL, EPHEMERAL)
// ------------------------------------------------------------
const globalAny = globalThis as any;

if (!globalAny.__SOLACE_WORKING_MEMORY__) {
  globalAny.__SOLACE_WORKING_MEMORY__ = new Map<
    string,
    WorkingMemoryItem[]
  >();
}

const WM_STORE: Map<string, WorkingMemoryItem[]> =
  globalAny.__SOLACE_WORKING_MEMORY__;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function nowISO(): string {
  return new Date().toISOString();
}

// ------------------------------------------------------------
// PUBLIC API (EXPLICIT, STABLE)
// ------------------------------------------------------------
export function getWorkingMemory(
  sessionId: string
): WorkingMemoryItem[] {
  return WM_STORE.get(sessionId) ?? [];
}

export function addWorkingMemoryItem(
  sessionId: string,
  item: {
    role: WorkingMemoryRole;
    content: string;
  }
): void {
  const existing = WM_STORE.get(sessionId) ?? [];

  const next: WorkingMemoryItem = {
    role: item.role,
    content: item.content,
    created_at: nowISO(),
  };

  WM_STORE.set(sessionId, [...existing, next]);
}

export function clearWorkingMemory(sessionId: string): void {
  WM_STORE.delete(sessionId);
}
