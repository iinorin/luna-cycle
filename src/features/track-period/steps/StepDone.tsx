import { View, Text, Pressable, StyleSheet } from "react-native";

type CycleData = {
  cycleLength: number;
  lastPeriod: Date;
  periodDuration: number;
  regularity: string;
  symptoms?: string[];
};

type Props = {
  data: CycleData;
  onEdit: (step: number) => void;
  onSave: () => void;
};

export default function StepDone({ data, onEdit, onSave }: Props) {
  const hasSymptoms =
    Array.isArray(data.symptoms) && data.symptoms.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review Details</Text>

      {/* INFO CARDS */}
      <InfoCard
        label="Cycle Length"
        value={`${data.cycleLength} days`}
        onEdit={() => onEdit(1)}
      />

      <InfoCard
        label="Last Period"
        value={data.lastPeriod.toDateString()}
        onEdit={() => onEdit(2)}
      />

      <InfoCard
        label="Period Duration"
        value={`${data.periodDuration} days`}
        onEdit={() => onEdit(3)}
      />

      <InfoCard
        label="Regularity"
        value={data.regularity}
        onEdit={() => onEdit(4)}
      />

      {hasSymptoms && (
        <InfoCard
          label="Symptoms"
          value={data.symptoms!.join(", ")}
          onEdit={() => onEdit(5)}
        />
      )}

      {/* SAVE */}
      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          pressed && styles.pressed,
        ]}
        onPress={onSave}
      >
        <Text style={styles.saveText}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

/* 🔹 INFO CARD COMPONENT */
function InfoCard({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <Pressable onPress={onEdit}>
        <Text style={styles.editText}>Edit</Text>
      </Pressable>
    </View>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#020617",
    padding: 22,
    borderRadius: 22,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  /* CARD */
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#020617",
  },
  cardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  value: {
    color: "#E5E7EB",
    fontSize: 16,
    marginTop: 4,
  },

  /* EDIT */
  editText: {
    color: "#EC4899",
    fontWeight: "600",
  },

  /* SAVE */
  saveBtn: {
    backgroundColor: "#EC4899",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  pressed: {
    opacity: 0.7,
  },
});
