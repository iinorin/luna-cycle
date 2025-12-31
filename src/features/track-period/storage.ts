import { create } from "zustand";

type CycleData = {
  cycleLength: number;
  lastPeriod: Date;
  periodDuration: number;
};

type CycleStore = {
  cycle: CycleData | null;
  setCycle: (data: CycleData) => void;
};

export const useCycleStore = create<CycleStore>((set) => ({
  cycle: null,
  setCycle: (data) => set({ cycle: data }),
}));
