export type Regularity = "regular" | "irregular" | "not_sure";

export type TrackPeriodData = {
  cycleLength: number;
  lastPeriod: Date;
  periodDuration: number;
  regularity: Regularity;
  symptoms: string[];
};
