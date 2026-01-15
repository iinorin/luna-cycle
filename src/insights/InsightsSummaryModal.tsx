import { View, Text, StyleSheet, Modal, Pressable } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;

  cycleDay: number;
  cycleLength: number;

  avgPain: number;
  mostPainArea?: string;

  bleedingDays: number;

  moodStreak: {
    current: number;
    best: number;
  };
};

export default function InsightsSummaryModal({
  visible,
  onClose,
  cycleDay,
  cycleLength,
  avgPain,
  mostPainArea,
  bleedingDays,
  moodStreak,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          <Text style={styles.title}>📊 Insights Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Cycle</Text>
            <Text style={styles.value}>
              Day {cycleDay} / {cycleLength}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Avg Pain</Text>
            <Text style={styles.value}>
              {avgPain}/10
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Most Pain Area</Text>
            <Text style={styles.value}>
              {mostPainArea || "—"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Bleeding Days (month)</Text>
            <Text style={styles.value}>
              {bleedingDays}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mood Streak</Text>
            <Text style={styles.value}>
              {moodStreak.current} 🔥 (Best {moodStreak.best})
            </Text>
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: "88%",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  value: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  closeBtn: {
    marginTop: 16,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#a78bfa",
    fontWeight: "700",
  },
});
