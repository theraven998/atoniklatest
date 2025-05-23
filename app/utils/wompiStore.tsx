// wompiStore.ts
import { create } from 'zustand';

export const useWompiStore = create((set) => ({
  wompiData: null,
  setWompiData: (data) => set({ wompiData: data }),
}));
