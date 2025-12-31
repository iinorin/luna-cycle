import { CycleData } from "@/src/features/track-period/storage";

const DAY = 1000 * 60 * 60 * 24;

export function calculateCycleInfo(cycle: CycleData) {
  const lastPeriodDate = new Date(cycle.lastPeriod);
  const today = new Date();

  const daysSinceLastPeriod = Math.floor(
    (today.getTime() - lastPeriodDate.getTime()) / DAY
  );

  const cycleDay =
    ((daysSinceLastPeriod % cycle.cycleLength) + cycle.cycleLength) %
      cycle.cycleLength +
    1;

  const nextPeriod = new Date(lastPeriodDate);
  nextPeriod.setDate(lastPeriodDate.getDate() + cycle.cycleLength);

  // Ovulation approx = 14 days before next period
  const ovulationDay = cycle.cycleLength - 14;

  const fertileStartDay = ovulationDay - 5;
  const fertileEndDay = ovulationDay + 1;

  const fertileWindow = {
    startDay: fertileStartDay,
    endDay: fertileEndDay,
  };

  return {
    cycleDay,
    nextPeriod,
    ovulationDay,
    fertileWindow,
    isFertile:
      cycleDay >= fertileStartDay && cycleDay <= fertileEndDay,
  };
}
