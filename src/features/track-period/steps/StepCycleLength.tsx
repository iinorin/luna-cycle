import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

type Props = {
  value: number;
  onNext: (value: number) => void;
};

export default function StepCycleLength({ value, onNext }: Props) {
  const [cycle, setCycle] = useState(value);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cycle Length</Text>

      <Text style={styles.value}>{cycle} days</Text>

      <Pressable
        style={styles.button}
        onPress={() => setCycle((v) => v + 1)}
      >
        <Text style={styles.buttonText}>Increase</Text>
      </Pressable>

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
  },
  button: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  next: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  nextText: {
    color: "#EC4899",
    fontWeight: "600",
  },
});
