import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import TrackCard from "../components/TrackCard";
import { Regularity } from "../types";

type Props = {
  value: Regularity;
  onNext: (value: Regularity) => void;
  onBack?: () => void;
};

const OPTIONS: Regularity[] = ["regular", "irregular","Sometimes", "not_sure"];

export default function StepRegularity({ value, onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Regularity>(value);

  return (
    <TrackCard title="Cycle regularity">
      {OPTIONS.map((opt) => (
        <Pressable
          key={opt}
          onPress={() => setSelected(opt)}
          style={[
            styles.option,
            selected === opt && styles.active,
          ]}
        >
          <Text style={styles.text}>
            {opt.replace("_", " ")}
          </Text>
        </Pressable>
      ))}

      <View style={styles.actions}>
        {onBack && (
          <Pressable onPress={onBack}>
            <Text style={styles.back}>Back</Text>
          </Pressable>
        )}

        <Pressable onPress={() => onNext(selected)}>
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
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  back: {
    color: "#9CA3AF",
  },
  next: {
    color: "#EC4899",
    fontWeight: "700",
  },
});
