import { CyclePhase } from "./types";

type Gradient = readonly [string, string];

export const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#FF6B6B",
  follicular: "#4D96FF",
  ovulation: "#FFB703",
  safe: "#4ADE80",
  luteal: "#A855F7",
};

export const PHASE_GRADIENTS: Record<CyclePhase, Gradient> = {
  menstrual: ["#FF6B6B", "#FF8E8E"],
  follicular: ["#4D96FF", "#6FA8FF"],
  ovulation: ["#FFB703", "#FFD166"],
  safe: ["#4ADE80", "#86EFAC"],
  luteal: ["#A855F7", "#7C3AED"],
};
