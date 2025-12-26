import { CycleState } from "./types";

export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

export function calculateCyclePhase(
  lastPeriodStart: string,
  cycleLength: number,
  periodLength: number
): CyclePhase {
  const today = new Date();
  const lastPeriod = new Date(lastPeriodStart);

  const diffInMs = today.getTime() - lastPeriod.getTime();
  const dayOfCycle = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;

  if (dayOfCycle <= periodLength) return "menstrual";
  if (dayOfCycle <= cycleLength / 2 - 2) return "follicular";
  if (dayOfCycle <= cycleLength / 2 + 2) return "ovulation";

  return "luteal";
}

export const DEFAULT_CYCLE_STATE: CycleState = {
  lastPeriodStart: "2025-01-01",
  cycleLength: 28,
  periodLength: 5,
  currentPhase: calculateCyclePhase("2025-01-01", 28, 5),
};
