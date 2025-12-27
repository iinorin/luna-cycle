import { View, Text, StyleSheet } from "react-native";
import { CyclePhase } from "../cycle/types";
import { PHASE_COLORS } from "../cycle/colors";

type Props = {
  day: number;
  phase: CyclePhase;
};

export function CycleTooltip({ day, phase }: Props) {
  return (
    <View style={[styles.container, { borderColor: PHASE_COLORS[phase] }]}>
      <Text style={styles.day}>Day {day}</Text>
      <Text style={[styles.phase, { color: PHASE_COLORS[phase] }]}>
        {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
  },
  day: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  phase: {
    fontSize: 11,
    marginTop: 2,
  },
});
