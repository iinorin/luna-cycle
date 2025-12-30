import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

type Props = {
  value: number;
  onNext: (value: number) => void;
};

export default function StepCycleLength({ value, onNext }: Props) {
  const [cycle, setCycle] = useState(value);

  const increase = () => setCycle((v) => v + 1);
  const decrease = () =>
    setCycle((v) => (v > 21 ? v - 1 : v)); // safe min

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cycle Length</Text>

      <Text style={styles.value}>{cycle} days</Text>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Decrease */}
        <Pressable
          onPress={decrease}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.pressedDecrease,
          ]}
        >
          <Text style={styles.controlText}>−</Text>
          <Text style={styles.controlLabel}>Decrease</Text>
        </Pressable>

        {/* Increase */}
        <Pressable
          onPress={increase}
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.pressedIncrease,
          ]}
        >
          <Text style={styles.controlText}>+</Text>
          <Text style={styles.controlLabel}>Increase</Text>
        </Pressable>
      </View>

      <Pressable style={styles.next} onPress={() => onNext(cycle)}>
        <Text style={styles.nextText}>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#020617",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  value: {
    color: "white",
    fontSize: 20,
    marginVertical: 16,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  controlButton: {
    backgroundColor: "#334155",
    width: 110,
    height: 80,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedIncrease: {
    backgroundColor: "#4ade80", // green
  },
  pressedDecrease: {
    backgroundColor: "#f87171", // red
  },
  controlText: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
  },
  controlLabel: {
    color: "#e5e7eb",
    fontSize: 12,
    marginTop: 2,
  },
  next: {
    marginTop: 24,
    alignSelf: "flex-end",
  },
  nextText: {
    color: "#EC4899",
    fontWeight: "600",
  },
});
