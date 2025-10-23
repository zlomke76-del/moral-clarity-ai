"use client";
import { create } from "zustand";

type SolaceState = {
  visible: boolean;
  x: number;
  y: number;
  filters: Set<string>;
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
  x: 16,
  y: 16,
  filters: new Set(),

  show: () => set({ visible: true }),
  hide: () => set({ visible: false }),
  toggle: () => set((s) => ({ visible: !s.visible })),

  setPos: (nx, ny) => set({ x: nx, y: ny }),

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
