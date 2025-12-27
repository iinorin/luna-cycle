import { View, StyleSheet } from "react-native";

import { DEFAULT_CYCLE_STATE } from "../src/cycle/state";
import { CycleRing } from "../src/components/CycleRing";
import { ScreenBackground } from "../src/components/ScreenBackground";
import { HeaderCard } from "../src/components/HeaderCard";

export default function HomeScreen() {
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <HeaderCard />

        <CycleRing
          cycleLength={DEFAULT_CYCLE_STATE.cycleLength}
          periodLength={DEFAULT_CYCLE_STATE.periodLength}
          currentDay={12} // temp for now
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
