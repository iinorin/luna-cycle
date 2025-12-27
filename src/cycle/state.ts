import { CyclePhase, CycleState } from "./types";

/**
 * Default cycle configuration.
 * Later replaced by user input.
 */
export const DEFAULT_CYCLE_STATE: CycleState = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: new Date("2025-01-01"),
};

/**
 * Returns current day in cycle (1-based)
 */
export function getCurrentCycleDay(state: CycleState): number {
  const today = new Date();
  const diffTime =
    today.getTime() - state.lastPeriodStart.getTime();

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return (diffDays % state.cycleLength) + 1;
}

/**
 * Returns phase for a given cycle day
 */
export function getPhaseForDay(
  day: number,
  periodLength: number
): CyclePhase {
  if (day <= periodLength) return "menstrual";
  if (day <= periodLength + 6) return "follicular";
  if (day <= periodLength + 8) return "ovulation";
  if (day <= 24) return "safe";
  return "luteal";
}
