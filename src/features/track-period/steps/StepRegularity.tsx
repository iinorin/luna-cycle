import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";
import { Regularity } from "../types";

type Props = {
  value: Regularity;
  onNext: (value: Regularity) => void;
  onBack?: () => void;
};

const OPTIONS: Regularity[] = ["regular", "irregular", "not_sure"];

export default function StepRegularity({ value, onNext, onBack }: Props) {
  return (
    <TrackCard title="Cycle regularity">
      {OPTIONS.map(opt => (
        <Pressable
          key={opt}
          onPress={() => onNext(opt)}
          style={[
            styles.option,
            value === opt && styles.active,
          ]}
        >
          <Text style={styles.text}>{opt}</Text>
        </Pressable>
      ))}

      {onBack && (
        <Pressable onPress={onBack}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
      )}
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
  back: {
    color: "#9CA3AF",
    marginTop: 10,
  },
});
