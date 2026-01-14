import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onSummaryPress?: () => void;
  onDownloadPress?: () => void;
};

export default function InsightsMenu({
  onSummaryPress,
  onDownloadPress,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Three-dot button */}
      <Pressable onPress={() => setOpen(true)} hitSlop={12}>
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color="#e9d5ff"
        />
      </Pressable>

      {/* Menu */}
      {open && (
        <View style={styles.overlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setOpen(false)}
          />

          <View style={styles.menu}>
            <Pressable
              style={styles.item}
              onPress={() => {
                setOpen(false);
                onSummaryPress?.();
              }}
            >
              <Ionicons
                name="stats-chart-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.text}>View Summary</Text>
            </Pressable>

            <Pressable
              style={styles.item}
              onPress={() => {
                setOpen(false);
                onDownloadPress?.();
              }}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.text}>Download PDF</Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    top: 70,
    right: 16,
    width: 180,
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
