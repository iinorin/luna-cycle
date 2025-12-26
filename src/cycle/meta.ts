import { CyclePhase } from "./types";

export const PHASE_META: Record<
  CyclePhase,
  {
    label: string;
    emoji: string;
    color: string;
  }
> = {
  menstrual: {
    label: "Menstrual Phase",
    emoji: "🩸",
    color: "#FADADD",
  },
  follicular: {
    label: "Follicular Phase",
    emoji: "🌱",
    color: "#E6F4EA",
  },
  ovulation: {
    label: "Ovulation Phase",
    emoji: "✨",
    color: "#FFF3C4",
  },
  luteal: {
    label: "Luteal Phase",
    emoji: "🌙",
    color: "#EDE7F6",
  },
};
