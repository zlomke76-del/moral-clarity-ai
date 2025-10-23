"use client";

import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";

type SolaceState = {
  // UI
  visible: boolean;
  x: number;
  y: number;

  // filters act as overlays (e.g., "abrahamic","ministry","guidance")
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

// Explicitly type the zustand hook so TS knows about getState/setState
export const useSolaceStore: UseBoundStore<StoreApi<SolaceState>> =
  create<SolaceState>((set, get) => ({
    visible: true,
    x: 24,
    y: 24,
    filters: new Set<string>(),

    show: () => set({ visible: true }),
    hide: () => set({ visible: false }),
    toggle: () => set((s) => ({ visible: !s.visible })),
    setPos: (nx, ny) => set({ x: nx, y: ny }),

    setFilters: (next) =>
      set({
        filters: Array.isArray(next) ? new Set(next) : new Set(next),
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

