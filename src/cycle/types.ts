export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal";

export type CycleState = {
  cycleLength: number;        
  periodLength: number;       
  lastPeriodStart: string;    // ISO date
  currentPhase: CyclePhase;
};
