import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

const OPTIONS = ["Cramps", "Mood swings", "Headache", "Bloating"];

export default function StepSymptoms({
  value,
  onChange,
  onNext,
  onBack,
}: Props) {
  function toggle(symptom: string) {
    if (value.includes(symptom)) {
      onChange(value.filter((s) => s !== symptom));
    } else {
      onChange([...value, symptom]);
    }
  }

  return (
    <TrackCard title="Any symptoms?">
      {OPTIONS.map((s) => (
        <Pressable
          key={s}
          onPress={() => toggle(s)}
          style={[
            styles.option,
            value.includes(s) && styles.active,
          ]}
        >
          <Text style={styles.text}>{s}</Text>
        </Pressable>
      ))}

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
  option: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#020617",
    marginBottom: 12,
  },
  active: {
    backgroundColor: "#EC4899",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  back: {
    color: "#9CA3AF",
  },
  next: {
    color: "#EC4899",
    fontWeight: "700",
  },
});
