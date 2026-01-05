import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import PainToggle from "./PainToggle";
import PainTypeGrid from "./PainTypeGrid";
import PainLevelBar from "./PainLevelBar";

export default function PainScreen() {
  const [hasPain, setHasPain] = useState<boolean | null>(null);
  const [selectedPain, setSelectedPain] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pain Check</Text>

      <PainToggle value={hasPain} onChange={setHasPain} />

      {/* NO PAIN STATE */}
      {hasPain === false && (
        <View style={styles.goodCard}>
          <Text style={styles.goodText}>✨ Yay! You’re doing good today</Text>
          {/* later you can add happy image here */}
        </View>
      )}

      {/* PAIN FLOW */}
      {hasPain === true && (
        <>
          <PainTypeGrid
            selected={selectedPain}
            onSelect={setSelectedPain}
          />

          {selectedPain && <PainLevelBar />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0f1a",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
  },
  goodCard: {
    marginTop: 30,
    padding: 24,
    borderRadius: 20,
    backgroundColor: "rgba(120,200,255,0.15)",
    alignItems: "center",
  },
  goodText: {
    color: "#bde6ff",
    fontSize: 16,
  },
});
