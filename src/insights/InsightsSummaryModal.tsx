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
