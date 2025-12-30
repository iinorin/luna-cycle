import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Regularity = "regular" | "sometimes" | "irregular";

type Props = {
  value: Regularity;
  onChange: (v: Regularity) => void;
  onNext: () => void;
};

export default function StepRegularity({
  value,
  onChange,
  onNext,
}: Props) {
  const options: { label: string; value: Regularity }[] = [
    { label: "Regular", value: "regular" },
    { label: "Sometimes", value: "sometimes" },
    { label: "Irregular", value: "irregular" },
  ];

  return (
    <TrackCard>
      <Text style={styles.question}>
        Are your periods usually regular?
      </Text>

      <View style={styles.column}>
        {options.map((o) => (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            style={[
              styles.option,
              value === o.value && styles.active,
            ]}
          >
            <Text style={styles.text}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.next} onPress={onNext}>
        <Text style={styles.nextText}>Next</Text>
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
  column: {
    gap: 10,
  },
  option: {
    backgroundColor: "#1F2933",
    padding: 14,
    borderRadius: 14,
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
