import { View, Text, StyleSheet } from "react-native";
import { DEFAULT_CYCLE_STATE } from "../src/cycle/state";
import { PHASE_META } from "../src/cycle/meta";
import { getDailyMessageForPhase } from "../src/messages/selector";

export default function HomeScreen() {
  const phase = DEFAULT_CYCLE_STATE.currentPhase;
  const meta = PHASE_META[phase];
  const message = getDailyMessageForPhase(phase);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <Text style={styles.phase}>{meta.label}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  emoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  phase: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#cbd5f5",
    textAlign: "center",
  },
});
