import { View, StyleSheet } from "react-native";
import { HeaderCard } from "@/src/components/HeaderCard";
import { CycleRing } from "@/src/components/CycleRing";

import {
  DEFAULT_CYCLE_STATE,
  getCurrentCycleDay,
  getPhaseForDay,
} from "@/src/cycle/state";

import BleedingRow from "@/src/features/bleeding/components/BleedingRow";

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  return (
    <View style={styles.container}>
      <HeaderCard phase={currentPhase} />

      <View style={styles.center}>
        <CycleRing
          cycleLength={cycleLength}
          periodLength={periodLength}
          currentDay={currentDay}
        />

        {/* 🩸 BLEEDING TRACKER */}
        <BleedingRow
          day={currentDay}
          isPeriodDay={currentDay <= periodLength}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
