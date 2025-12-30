export type Regularity = "regular" | "irregular" | "Sometimes" | "not_sure";

export type TrackPeriodData = {
  cycleLength: number;
  lastPeriod: Date;
  periodDuration: number;
  regularity: Regularity;
  symptoms: string[];
};
