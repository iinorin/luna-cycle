export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "safe"
  | "luteal";

export type CycleState = {
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: Date;
};
