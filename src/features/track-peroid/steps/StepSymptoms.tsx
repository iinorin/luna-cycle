import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

const SYMPTOMS = [
  "Cramps",
  "Acne",
  "Mood swings",
  "Headache",
  "Fatigue",
];

type Props = {
  value: string[];
  onChange: (v: string[]) => void;
  onNext: () => void;
};

export default function StepSymptoms({
  value,
  onChange,
  onNext,
}: Props) {
  const toggle = (s: string) => {
    if (value.includes(s)) {
      onChange(value.filter((x) => x !== s));
    } else {
      onChange([...value, s]);
    }
  };

  return (
    <TrackCard>
      <Text style={styles.question}>
        Do you usually experience any of these?
      </Text>

      <View style={styles.row}>
        {SYMPTOMS.map((s) => (
          <Pressable
            key={s}
            onPress={() => toggle(s)}
            style={[
              styles.chip,
              value.includes(s) && styles.active,
            ]}
          >
            <Text style={styles.text}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.next} onPress={onNext}>
        <Text style={styles.nextText}>Finish</Text>
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
    flexWrap: "wrap",
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
