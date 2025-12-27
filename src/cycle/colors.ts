import { CyclePhase } from "./types";

export const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#FF5C8A",   // Period
  follicular: "#FFD166", // Safe / growing
  ovulation: "#06D6A0",  // Fertile
  luteal: "#8E9AAF",     // Post-ovulation
  safe: "#CDB4DB",       // General safe days
};

export function getPhaseColor(phase: CyclePhase): string {
  return PHASE_COLORS[phase];
}