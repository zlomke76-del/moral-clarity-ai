"use client";

/**
 * Tiny dependency-free UI store for the Solace dock.
 * Works across components via useSyncExternalStore.
 */

import { useMemo, useSyncExternalStore } from "react";

type SolaceState = {
  visible: boolean;
  x: number;
  y: number;
  filters: Set<string>;
};

type SolaceActions = {
  toggle: () => void;
  setPos: (x: number, y: number) => void;
  setFilters: (next: Set<string> | string[]) => void;
  clearFilters: () => void;
};

/* ---------- internal store ---------- */

let state: SolaceState = {
  visible: true,
  x: 16,
  y: typeof window !== "undefined" ? Math.max(16, window.innerHeight - 420) : 16,
  filters: new Set<string>(),
};

const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setState(partial: Partial<SolaceState>) {
  state = { ...state, ...partial };
  emit();
}

/* ---------- subscription API ---------- */

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

/* ---------- hook ---------- */

export function useSolaceStore(): SolaceState & SolaceActions {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const actions = useMemo<SolaceActions>(
    () => ({
      toggle: () => setState({ visible: !state.visible }),
      setPos: (x: number, y: number) => setState({ x, y }),
      setFilters: (next: Set<string> | string[]) => {
        const s = Array.isArray(next) ? new Set(next) : next;
        setState({ filters: new Set(s) });
      },
      clearFilters: () => setState({ filters: new Set() }),
    }),
    []
  );

  return { ...snap, ...actions };
}
