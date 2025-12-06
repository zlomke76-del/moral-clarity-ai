"use client";

import { create } from "zustand";

type SolaceState = {
  visible: boolean;
  x: number;
  y: number;
  filters: Set<string>;

  setVisible: (v: boolean) => void;
  setPos: (x: number, y: number) => void;
  setFilters: (f: Set<string> | string[]) => void;
};

export const useSolaceStore = create<SolaceState>((set) => ({
  visible: true,
  x: 100,
  y: 100,
  filters: new Set(),

  setVisible: (v) => set({ visible: v }),
  setPos: (x, y) => set({ x, y }),
  setFilters: (f) =>
    set({ filters: f instanceof Set ? f : new Set(f) }),
}));

