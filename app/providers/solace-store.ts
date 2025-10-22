"use client";
import { create } from "zustand";

type SolaceState = {
  visible: boolean;
  x: number;
  y: number;
  filters: Set<string>; // multi-select (e.g., "abrahamic","ministry","guidance")
  setVisible(v: boolean): void;
  setPos(x: number, y: number): void;
  toggle(filter: string): void;
  setFilters(next: string[] | Set<string>): void;
  clearFilters(): void;
};

export const useSolaceStore = create<SolaceState>((set, get) => ({
  visible: true,
  x: 24,
  y: typeof window !== "undefined" ? window.innerHeight - 280 : 400,
  filters: new Set<string>(),
  setVisible: (v) => set({ visible: v }),
  setPos: (x, y) => set({ x, y }),
  toggle: (f) => {
    const next = new Set(get().filters);
    next.has(f) ? next.delete(f) : next.add(f);
    set({ filters: next });
  },
  setFilters: (next) =>
    set({ filters: new Set(Array.isArray(next) ? next : Array.from(next)) }),
  clearFilters: () => set({ filters: new Set() }),
}));
