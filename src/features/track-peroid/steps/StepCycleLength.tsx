import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Props = {
  value: number;
  onChange: (v: number) => void;
  onNext: () => void;
};

export default function StepCycleLength({
  value,
  onChange,
  onNext,
}: Props) {
  return (
    <TrackCard>
      <Text style={styles.question}>
        Average cycle length
      </Text>

      <View style={styles.row}>
        {[26, 28, 30].map((d) => (
          <Pressable
            key={d}
            onPress={() => onChange(d)}
            style={[
              styles.chip,
              value === d && styles.active,
            ]}
          >
            <Text style={styles.text}>{d} days</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.next} onPress={onNext}>
        <Text style={styles.nextText}>Save</Text>
      </Pressable>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  question: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    backgroundColor: "#1F2933",
    padding: 12,
    borderRadius: 12,
  },
  active: {
    backgroundColor: "#EC4899",
  },
  text: {
    color: "#fff",
  },
  next: {
    marginTop: 20,
    backgroundColor: "#EC4899",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
  },
});
