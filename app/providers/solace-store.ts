"use client";

import { create } from "zustand";

type SolaceState = {
  // visibility + position
  visible: boolean;
  x: number;
  y: number;

  // filters behave like multi-select tags (e.g., "abrahamic","ministry","guidance")
  filters: Set<string>;

  // actions
  show(): void;
  hide(): void;
  toggle(): void;
  setPos(nx: number, ny: number): void;
  setFilters(next: string[] | Set<string>): void;
  addFilter(tag: string): void;
  removeFilter(tag: string): void;
  clearFilters(): void;
};

export const useSolaceStore = create<SolaceState>((set) => ({
  visible: true,
  x: 24,
  y: 24 + 56, // a bit under the header
  filters: new Set(),

  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  toggle: () => set((s) => ({ visible: !s.visible })),
  setPos: (nx, ny) => set({ x: Math.max(8, nx), y: Math.max(8, ny) }),

  setFilters: (next) =>
    set({
      filters: new Set(Array.isArray(next) ? next : Array.from(next)),
    }),

  addFilter: (tag) =>
    set((s) => {
      const n = new Set(s.filters);
      n.add(tag);
      return { filters: n };
    }),

  removeFilter: (tag) =>
    set((s) => {
      const n = new Set(s.filters);
      n.delete(tag);
      return { filters: n };
    }),

  clearFilters: () => set({ filters: new Set() }),
}));
