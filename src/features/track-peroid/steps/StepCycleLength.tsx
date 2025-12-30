import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Props = {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepCycleLength({
  value,
  onChange,
  onNext,
  onBack,
}: Props) {
  return (
    <TrackCard title="Cycle Length">
      <Text style={styles.value}>{value} days</Text>

      <View style={styles.row}>
        <Pressable onPress={() => onChange(Math.max(21, value - 1))}>
          <Text style={styles.btn}>−</Text>
        </Pressable>

        <Pressable onPress={() => onChange(Math.min(35, value + 1))}>
          <Text style={styles.btn}>+</Text>
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>Back</Text>
        </Pressable>

        <Pressable onPress={onNext}>
          <Text style={styles.next}>Next</Text>
        </Pressable>
      </View>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  value: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  btn: {
    color: "#EC4899",
    fontSize: 36,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  back: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  next: {
    color: "#EC4899",
    fontSize: 16,
    fontWeight: "700",
  },
});
