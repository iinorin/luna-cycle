import { CycleDots } from "./CycleDots";
import { DEFAULT_CYCLE_STATE } from "../cycle/state";
import { CyclePhase } from "../cycle/types";

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#ff6b81",   // soft red
  follicular: "#4dabf7",  // blue
  ovulation: "#51cf66",   // green
  luteal: "#fcc419",      // yellow
};

export function CycleRing() {
  const { cycleLength, currentPhase } = DEFAULT_CYCLE_STATE;

  const dots = Array.from({ length: cycleLength }).map(
    (_, index) => ({
      color: PHASE_COLORS[currentPhase],
      isActive: index === 2, // temp: day 3
    })
  );

  return <CycleDots dots={dots} />;
}
