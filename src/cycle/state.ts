import { CyclePhase, CycleState, CycleDayUI } from "./types";

/**
 * Default cycle configuration
 * (can later come from user settings / backend)
 */
export const DEFAULT_CYCLE_STATE: CycleState = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: "2025-01-05", // ISO date
};

/**
 * Phase colors used by UI
 */
export const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#E53935",   // Red
  follicular: "#43A047",  // Green
  ovulation: "#FDD835",   // Yellow
  luteal: "#FB8C00",      // Orange
  safe: "#DADADA",        // Grey
};

/**
 * Calculate cycle phase for a given cycle day
 */
export function getPhaseForDay(
  day: number,
  state: CycleState
): CyclePhase {
  const periodStart = 1;
  const periodEnd = state.periodLength;

  const ovulationDay = Math.floor(state.cycleLength / 2);

  if (day >= periodStart && day <= periodEnd) {
    return "menstrual";
  }

  if (day >= ovulationDay - 2 && day <= ovulationDay + 1) {
    return "ovulation";
  }

  if (day > periodEnd && day < ovulationDay - 2) {
    return "follicular";
  }

  if (day > ovulationDay + 1) {
    return "luteal";
  }

  return "safe";
}

/**
 * Generate UI-ready cycle data for rendering dots / rings
 */
export function generateCycleUI(
  state: CycleState = DEFAULT_CYCLE_STATE
): CycleDayUI[] {
  const today = new Date().toISOString().split("T")[0];

  return Array.from({ length: state.cycleLength }).map((_, index) => {
    const day = index + 1;
    const phase = getPhaseForDay(day, state);

    return {
      day,
      phase,
      color: PHASE_COLORS[phase],
      isPeriod: phase === "menstrual",
      isOvulation: phase === "ovulation",
      isSafe: phase === "safe",
      isToday: today === state.lastPeriodStart && day === 1,
    };
  });
}
