"use client";

import { create } from "zustand";

type SolaceState = {
  /* visibility & position */
  visible: boolean;
  x: number;
  y: number;

  /* active filters (e.g., "abrahamic", "ministry", "guidance") */
  filters: Set<string>;

  /* actions */
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setVisible: (v: boolean) => void;

  setPos: (x: number, y: number) => void;

  /** replace the current filter set (accepts Set or string[]) */
  setFilters: (next: Set<string> | string[]) => void;

  /** add/remove a single filter */
  addFilter: (f: string) => void;
  removeFilter: (f: string) => void;
  clearFilters: () => void;
};

export const useSolaceStore = create<SolaceState>((set, get) => ({
  /* defaults: dock visible, bottom-rightish */
  visible: true,
  x: typeof window !== "undefined" ? Math.max(8, window.innerWidth - 560) : 860,
  y: typeof window !== "undefined" ? Math.max(8, window.innerHeight - 420) : 520,

  filters: new Set<string>(),

  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  toggle: () => set((s) => ({ visible: !s.visible })),
  setVisible: (v) => set({ visible: v }),

  setPos: (x, y) =>
    set({
      x: Math.max(8, x),
      y: Math.max(8, y),
    }),

  setFilters: (next) =>
    set({
      filters: Array.isArray(next) ? new Set(next) : new Set(next),
    }),

  addFilter: (f) =>
    set((s) => {
      const nx = new Set(s.filters);
      nx.add(f);
      return { filters: nx };
    }),

  removeFilter: (f) =>
    set((s) => {
      const nx = new Set(s.filters);
      nx.delete(f);
      return { filters: nx };
    }),

  clearFilters: () => set({ filters: new Set<string>() }),
}));
