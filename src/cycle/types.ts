/**
 * Supported menstrual cycle phases
 */
export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "safe";

/**
 * User-defined cycle configuration
 */
export type CycleState = {
  cycleLength: number;       // Total cycle duration (e.g. 28 days)
  periodLength: number;      // Length of menstrual bleeding
  lastPeriodStart: string;   // ISO date (YYYY-MM-DD)
};

/**
 * Logical phase representation for a single cycle day
 */
export type DayPhase = {
  day: number;               // Day index within the cycle (1-based)
  phase: CyclePhase;
  isToday: boolean;
};

/**
 * UI-ready metadata for rendering cycle indicators
 */
export type CycleDayUI = {
  day: number;
  phase: CyclePhase;
  color: string;
  isPeriod: boolean;
  isOvulation: boolean;
  isSafe: boolean;
  isToday: boolean;
};
