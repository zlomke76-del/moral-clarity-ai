"use client";

import { useSyncExternalStore } from "react";

/** Shape of the dock’s shared state */
type SolaceSnapshot = {
  visible: boolean;
  x: number;
  y: number;
  /** active filters behave like tags; e.g. "abrahamic","ministry","guidance" */
  filters: Set<string>;
};

/** Internal mutable state (module singleton) */
let state: SolaceSnapshot = {
  visible: true,
  x: 24,
  y: 24,
  filters: new Set<string>(),
};

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

/** subscribe/get for useSyncExternalStore */
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): SolaceSnapshot {
  return state;
}

/* ---------- Mutators (immutable snapshots for React) ---------- */
function setState(patch: Partial<Omit<SolaceSnapshot, "filters">> & { filters?: Set<string> | string[] }) {
  const next: SolaceSnapshot = {
    ...state,
    ...patch,
    filters:
      patch.filters === undefined
        ? state.filters
        : patch.filters instanceof Set
        ? new Set(patch.filters)
        : new Set(patch.filters),
  };
  // Avoid emitting if nothing changed (cheap compare)
  if (
    next.visible === state.visible &&
    next.x === state.x &&
    next.y === state.y &&
    sameSet(next.filters, state.filters)
  ) {
    return;
  }
  state = next;
  emit();
}

function sameSet(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

/* ---------- Public API (hook) ---------- */
export function useSolaceStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    /* snapshot fields */
    visible: snap.visible,
    x: snap.x,
    y: snap.y,
    filters: snap.filters,

    /* actions */
    show() {
      setState({ visible: true });
    },
    hide() {
      setState({ visible: false });
    },
    toggle() {
      setState({ visible: !state.visible });
    },
    setPos(nx: number, ny: number) {
      setState({ x: Math.max(8, Math.round(nx)), y: Math.max(8, Math.round(ny)) });
    },
    setFilters(next: Set<string> | string[]) {
      setState({ filters: next });
    },
    addFilter(tag: string) {
      const next = new Set(state.filters);
      next.add(tag);
      setState({ filters: next });
    },
    removeFilter(tag: string) {
      const next = new Set(state.filters);
      next.delete(tag);
      setState({ filters: next });
    },
    clearFilters() {
      setState({ filters: new Set() });
    },
  };
}
