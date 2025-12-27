import { View, StyleSheet, PanResponder } from "react-native";
import { useState, useRef } from "react";
import { CycleDot } from "./CycleDots";
import { CycleTooltip } from "./CycleTooltip";
import { CyclePhase } from "../cycle/types";

type Props = {
  cycleLength: number;
  currentDay: number;
  phaseByDay: (day: number) => CyclePhase;
};

export function CycleRing({ cycleLength, currentDay, phaseByDay }: Props) {
  const [offset, setOffset] = useState(0);
  const [tooltip, setTooltip] = useState<{
    day: number;
    phase: CyclePhase;
  } | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50) setOffset(o => o + cycleLength);
        if (g.dx > 50) setOffset(o => Math.max(0, o - cycleLength));
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
      <View style={styles.ring}>
        {Array.from({ length: cycleLength }).map((_, i) => {
          const day = i + 1 + offset;
          const angle = (360 / cycleLength) * i;
          const phase = phaseByDay(day);

          return (
            <CycleDot
              key={day}
              index={i}
              angle={angle}
              phase={phase}
              isActive={day === currentDay}
              onPress={() =>
                setTooltip({ day, phase })
              }
            />
          );
        })}
      </View>

      <CycleTooltip
        visible={!!tooltip}
        day={tooltip?.day ?? 0}
        phase={tooltip?.phase ?? ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  ring: {
    width: 260,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },
});
