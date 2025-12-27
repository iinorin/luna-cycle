import { CyclePhase, CycleState } from "./types";

/**
 * Default cycle configuration.
 * This will later be replaced by user-provided data or backend values.
 */
export const DEFAULT_CYCLE_STATE: CycleState = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: "2025-01-01",
};

/**
 * Determines the cycle phase for a specific day in the cycle.
 *
 * @param day - Day number in the cycle (1-based index)
 * @param periodLength - Length of the menstrual period in days
 * @returns The cycle phase for the given day
 */
export function getPhaseForDay(
  day: number,
  periodLength: number
): CyclePhase {
  if (day <= periodLength) {
    return "menstrual";
  }

  if (day <= periodLength + 6) {
    return "follicular";
  }

  if (day <= periodLength + 8) {
    return "ovulation";
  }

  if (day <= 24) {
    return "safe";
  }

  return "luteal";
}
