import { CyclePhase } from "./state";

export const PHASE_META: Record<
  CyclePhase,
  { label: string; emoji: string }
> = {
  menstrual: {
    label: "Menstrual Phase",
    emoji: "🩸",
  },
  follicular: {
    label: "Follicular Phase",
    emoji: "🌱",
  },
  ovulation: {
    label: "Ovulation Phase",
    emoji: "🌸",
  },
  luteal: {
    label: "Luteal Phase",
    emoji: "🌙",
  },
};
