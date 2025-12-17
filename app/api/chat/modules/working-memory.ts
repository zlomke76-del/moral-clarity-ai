// ------------------------------------------------------------
// WORKING MEMORY (AUTHORITATIVE)
// Conversation-scoped, ephemeral, non-persistent
// Flush ONLY when explicitly instructed
// ------------------------------------------------------------

export type WMItem = {
  role: "user" | "assistant" | "system";
  content: string;
  ts?: number;
};

type WorkingMemoryInit = {
  sessionId: string;
  maxItems?: number;
};

export class WorkingMemory {
  readonly sessionId: string;
  readonly maxItems: number;

  private _items: WMItem[] = [];
  private _active = true;

  constructor(init: WorkingMemoryInit) {
    this.sessionId = init.sessionId;
    this.maxItems = init.maxItems ?? 40;

    console.log("[WM] initialized", {
      sessionId: this.sessionId,
      items: this._items.length,
    });
  }

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------
  get active(): boolean {
    return this._active;
  }

  get items(): WMItem[] {
    return this._items;
  }

  get size(): number {
    return this._items.length;
  }

  // ----------------------------------------------------------
  // Append (AUTHORITATIVE PATH)
  // ----------------------------------------------------------
  async append(item: WMItem): Promise<void> {
    if (!this._active) {
      console.warn("[WM] append_ignored_inactive", {
        sessionId: this.sessionId,
      });
      return;
    }

    this._items.push({
      ...item,
      ts: Date.now(),
    });

    // Enforce rolling window (oldest-first eviction)
    if (this._items.length > this.maxItems) {
      const overflow = this._items.length - this.maxItems;
      this._items.splice(0, overflow);

      console.log("[WM] evicted", {
        sessionId: this.sessionId,
        overflow,
        remaining: this._items.length,
      });
    }

    console.log("[WM] append", {
      sessionId: this.sessionId,
      role: item.role,
      size: this._items.length,
    });
  }

  // ----------------------------------------------------------
  // Snapshot (READ-ONLY)
  // ----------------------------------------------------------
  snapshot(): WMItem[] {
    return [...this._items];
  }

  // ----------------------------------------------------------
  // Turn boundary marker (NO FLUSH)
  // ----------------------------------------------------------
  markTurnComplete(reason: string = "turn_complete") {
    console.log("[WM] turn_complete", {
      sessionId: this.sessionId,
      items: this._items.length,
      reason,
    });
  }

  // ----------------------------------------------------------
  // Explicit flush (MANUAL ONLY)
  // ----------------------------------------------------------
  flush(reason: string = "explicit_flush") {
    const count = this._items.length;
    this._items = [];
    this._active = false;

    console.log("[WM] flushed", {
      sessionId: this.sessionId,
      items: count,
      reason,
    });
  }
}
