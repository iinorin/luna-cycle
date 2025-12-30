import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  data: {
    lastPeriodDate: Date;
    cycleLength: number;
    periodDuration: number;
    regularity: string;
    symptoms: string[];
  };
  onEdit: (step: number) => void;
};

export default function StepDone({ data, onEdit }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Cycle Summary</Text>

      <SummaryRow
        label="Last Period"
        value={data.lastPeriodDate.toDateString()}
        onEdit={() => onEdit(1)}
      />

      <SummaryRow
        label="Cycle Length"
        value={`${data.cycleLength} days`}
        onEdit={() => onEdit(2)}
      />

      <SummaryRow
        label="Period Duration"
        value={`${data.periodDuration} days`}
        onEdit={() => onEdit(3)}
      />

      <SummaryRow
        label="Regularity"
        value={data.regularity}
        onEdit={() => onEdit(4)}
      />

      <SummaryRow
        label="Symptoms"
        value={
          data.symptoms.length
            ? data.symptoms.join(", ")
            : "None"
        }
        onEdit={() => onEdit(5)}
      />

      <Pressable style={styles.save}>
        <Text style={styles.saveText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <Pressable onPress={onEdit} style={styles.row}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.edit}>Edit</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2933",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  value: {
    color: "#fff",
    fontSize: 14,
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
    borderRadius: 16,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
