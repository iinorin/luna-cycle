import { View, Text, Pressable, StyleSheet } from "react-native";
import { TrackPeriodData } from "../types";

type Props = {
  data: TrackPeriodData;
  onEdit: (step: number) => void;
};

export default function StepDone({ data, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Cycle Summary</Text>

      <Row label="Last Period" value={data.lastPeriod.toDateString()} onEdit={() => onEdit(1)} />
      <Row label="Cycle Length" value={`${data.cycleLength} days`} onEdit={() => onEdit(2)} />
      <Row label="Period Duration" value={`${data.periodDuration} days`} onEdit={() => onEdit(3)} />
      <Row label="Regularity" value={data.regularity} onEdit={() => onEdit(4)} />
      <Row label="Symptoms" value={data.symptoms.join(", ") || "None"} onEdit={() => onEdit(5)} />

      <Pressable style={styles.save}>
        <Text style={styles.saveText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

function Row({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Pressable onPress={onEdit}>
        <Text style={styles.edit}>Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#020617",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    color: "#94A3B8",
    fontSize: 13,
  },
  value: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  edit: {
    color: "#EC4899",
    fontWeight: "600",
  },
  save: {
    marginTop: 24,
    backgroundColor: "#EC4899",
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
