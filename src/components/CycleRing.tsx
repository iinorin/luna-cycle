import { View, StyleSheet } from "react-native";
import { PHASE_COLORS } from "../cycle/colors";
import { DEFAULT_CYCLE_STATE } from "../cycle/state";
import { calculateCyclePhase } from "../cycle/state";

type Props = {
  size?: number;
};

export function CycleRing({ size = 220 }: Props) {
  const radius = size / 2;
  const dotSize = 8;
  const totalDays = DEFAULT_CYCLE_STATE.cycleLength;

  const today = new Date();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Array.from({ length: totalDays }).map((_, index) => {
        const angle = (2 * Math.PI * index) / totalDays;

        const x =
          radius +
          (radius - 16) * Math.cos(angle) -
          dotSize / 2;

        const y =
          radius +
          (radius - 16) * Math.sin(angle) -
          dotSize / 2;

        // Day number in cycle
        const dayNumber = index + 1;

        // Fake date for phase calculation
        const fakeDate = new Date(
          new Date(DEFAULT_CYCLE_STATE.lastPeriodStart).getTime() +
            index * 24 * 60 * 60 * 1000
        );

        const phase = calculateCyclePhase(
          fakeDate.toISOString().slice(0, 10),
          DEFAULT_CYCLE_STATE.cycleLength,
          DEFAULT_CYCLE_STATE.periodLength
        );

        const isToday =
          today.toDateString() === fakeDate.toDateString();

        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                left: x,
                top: y,
                backgroundColor: PHASE_COLORS[phase],
                opacity: isToday ? 1 : 0.5,
                transform: [{ scale: isToday ? 1.4 : 1 }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
