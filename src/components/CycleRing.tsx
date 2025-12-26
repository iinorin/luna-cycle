import { View, StyleSheet } from "react-native";
import { CyclePhase } from "../cycle/types";

type CycleRingProps = {
  cycleLength: number;
  currentDay: number; // 1-based
  phaseByDay: (day: number) => CyclePhase;
};

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#FF6B6B",
  follicular: "#4D96FF",
  ovulation: "#4CAF50",
  luteal: "#FBC02D",
};

export function CycleRing({
  cycleLength,
  currentDay,
  phaseByDay,
}: CycleRingProps) {
  const size = 260;
  const radius = 110;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Array.from({ length: cycleLength }).map((_, index) => {
        const day = index + 1;
        const angle = (2 * Math.PI * index) / cycleLength;

        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);

        const phase = phaseByDay(day);
        const isToday = day === currentDay;

        const dotSize = isToday ? 14 : 8;

        return (
          <View
            key={day}
            style={[
              styles.dot,
              {
                backgroundColor: PHASE_COLORS[phase],
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                opacity: isToday ? 1 : 0.45,
                transform: [
                  { translateX: x - dotSize / 2 },
                  { translateY: y - dotSize / 2 },
                ],
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
  },
});
