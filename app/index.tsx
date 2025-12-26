import { View, Text, StyleSheet } from "react-native";

import { DEFAULT_CYCLE_STATE } from "../src/cycle/state";
import { PHASE_META } from "../src/cycle/meta";
import { getDailyMessageForPhase } from "../src/messages/selector";
import { CycleRing } from "../src/components/CycleRing";


export default function HomeScreen() {
  const phase = DEFAULT_CYCLE_STATE.currentPhase;
  const meta = PHASE_META[phase];
  const message = getDailyMessageForPhase(phase);
  const daysLeft = 3;

return (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <Text style={{ fontSize: 22, marginBottom: 20 }}>
      🌙 Luna Cycle
    </Text>

    <CycleRing daysLeft={3} />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#fff",
    width: "85%",
    alignItems: "center",
    elevation: 4,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  phase: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
  },
});
