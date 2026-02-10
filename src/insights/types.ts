export type CycleProgressProps = {
  cycleDay: number;
  cycleLength: number;
  progressWidth: number;
  nextPeriod: Date;
  fertileWindow?: {
    start: number;
    end: number;
  };
};
