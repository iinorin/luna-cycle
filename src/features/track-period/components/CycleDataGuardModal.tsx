// features/track-period/components/CycleDataGuardModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  onKeep: () => void;
  onUpdate: () => void;
  onDelete: () => void;
};

export default function CycleDataGuardModal({
  visible,
  onKeep,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Cycle Data Found</Text>
          <Text style={styles.subtitle}>
            You already have cycle data saved. What would you like to do?
          </Text>

          <Pressable style={styles.primaryBtn} onPress={onKeep}>
            <Text style={styles.primaryText}>Keep Existing</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={onUpdate}>
            <Text style={styles.secondaryText}>Update Data</Text>
          </Pressable>

          <Pressable style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete Data</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  primaryBtn: {
    backgroundColor: "#ec4899",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#ec4899",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  secondaryText: {
    color: "#ec4899",
    fontWeight: "600",
    textAlign: "center",
  },
  deleteBtn: {
    padding: 12,
  },
  deleteText: {
    color: "#ef4444",
    textAlign: "center",
    fontWeight: "500",
  },
});
