import { View, StyleSheet } from "react-native";

import { DEFAULT_CYCLE_STATE, calculateCyclePhase } from "../src/cycle/state";
import { CycleRing } from "../src/components/CycleRing";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { HeaderCard } from "../src/components/HeaderCard";

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const currentDay = 12; // temp

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <HeaderCard />

        <CycleRing
          cycleLength={cycleLength}
          currentDay={currentDay}
          phaseByDay={() =>
            calculateCyclePhase(
              DEFAULT_CYCLE_STATE.lastPeriodStart,
              DEFAULT_CYCLE_STATE.cycleLength,
              DEFAULT_CYCLE_STATE.periodLength
            )
          }
        />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
