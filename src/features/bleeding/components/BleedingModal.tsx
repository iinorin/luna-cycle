import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

type BleedingLevel =
  | "none"
  | "spotting"
  | "light"
  | "medium"
  | "heavy";

const OPTIONS: {
  key: BleedingLevel;
  label: string;
  color: string;
}[] = [
  { key: "none", label: "No bleeding", color: "#64748B" },
  { key: "spotting", label: "Spotting", color: "#FCA5A5" },
  { key: "light", label: "Light", color: "#FB7185" },
  { key: "medium", label: "Medium", color: "#EF4444" },
  { key: "heavy", label: "Heavy", color: "#B91C1C" },
];

export default function BleedingModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: BleedingLevel;
  onSelect: (v: BleedingLevel) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card}>
          <Text style={styles.title}>Bleeding level</Text>

          {OPTIONS.map((opt) => {
            const active = selected === opt.key;

            return (
              <Pressable
                key={opt.key}
                style={[
                  styles.option,
                  active && { borderColor: opt.color },
                ]}
                onPress={() => onSelect(opt.key)}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: opt.color },
                  ]}
                />
                <Text style={styles.label}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  label: {
    color: "#CBD5F5",
    fontSize: 14,
  },
});
