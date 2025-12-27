import { View, StyleSheet, Text, PanResponder } from "react-native";
import { useState } from "react";
import { CycleDot } from "./CycleDots";
import { CycleTooltip } from "./CycleTooltip";
import { getPhaseForDay } from "../cycle/state";

type Props = {
  cycleLength: number;
  periodLength: number;
  currentDay: number;
};

const RING_SIZE = 260;
const DOT_RADIUS = 110;

export function CycleRing({
  cycleLength,
  periodLength,
  currentDay,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) setOffset((p) => p + cycleLength);
      if (g.dx > 50) setOffset((p) => Math.max(0, p - cycleLength));
    },
  });

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      {/* Center label */}
      <View style={styles.centerLabel}>
        <Text style={styles.centerSmall}>Today</Text>
        <Text style={styles.centerBig}>
          {getPhaseForDay(currentDay, periodLength)} Phase
        </Text>
      </View>

      {Array.from({ length: cycleLength }).map((_, i) => {
        const day = i + 1 + offset;
        const angle = (2 * Math.PI * i) / cycleLength - Math.PI / 2;

        const x =
          RING_SIZE / 2 + DOT_RADIUS * Math.cos(angle) - 8;
        const y =
          RING_SIZE / 2 + DOT_RADIUS * Math.sin(angle) - 8;

        const phase = getPhaseForDay(day, periodLength);

        return (
          <View
            key={i}
            style={[
              styles.dotWrapper,
              {
                left: x,
                top: y,
              },
            ]}
            onTouchEnd={() => setSelectedDay(day)}
          >
            <CycleDot
              phase={phase}
              isActive={day === currentDay}
              size={day === currentDay ? 20 : 14}
            />
          </View>
        );
      })}

      {selectedDay && (
        <CycleTooltip
          day={selectedDay}
          phase={getPhaseForDay(selectedDay, periodLength)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  dotWrapper: {
    position: "absolute",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
  },
  centerSmall: {
    color: "#999",
    fontSize: 12,
  },
  centerBig: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
