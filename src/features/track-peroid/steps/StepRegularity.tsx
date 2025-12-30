import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Regularity = "regular" | "sometimes" | "irregular";

type Props = {
  value: Regularity;
  onChange: (value: Regularity) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function StepRegularity({
  value,
  onChange,
  onNext,
  onBack,
}: Props) {
  const options: Regularity[] = ["regular", "sometimes", "irregular"];

  return (
    <TrackCard title="Are your periods regular?">
      {options.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => onChange(opt)}
          style={[
            styles.option,
            value === opt && styles.active,
          ]}
        >
          <Text style={styles.text}>{opt}</Text>
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
