import { View, Text, Pressable, StyleSheet } from "react-native";
import TrackCard from "../components/TrackCard";

type Props = {
  data: any;
  onEdit: (step: number) => void;
  onSave: () => void;
};

export default function StepDone({ data, onEdit, onSave }: Props) {
  return (
    <TrackCard title="Review details">
      <View style={styles.row}>
        <Text style={styles.label}>Cycle Length</Text>
        <Pressable onPress={() => onEdit(1)}>
          <Text style={styles.value}>{data.cycleLength} days</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Last Period</Text>
        <Pressable onPress={() => onEdit(2)}>
          <Text style={styles.value}>
            {data.lastPeriod.toDateString()}
          </Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Pressable onPress={() => onEdit(3)}>
          <Text style={styles.value}>{data.periodDuration} days</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Regularity</Text>
        <Pressable onPress={() => onEdit(4)}>
          <Text style={styles.value}>{data.regularity}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.save} onPress={onSave}>
        <Text style={styles.saveText}>Save & Continue</Text>
      </Pressable>
    </TrackCard>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  save: {
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#EC4899",
    fontWeight: "700",
  },
});
