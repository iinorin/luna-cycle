import { View, Text, StyleSheet, Pressable } from "react-native";

const bodyParts = [
  "Head", "Neck", "Chest", "Back",
  "Stomach", "Pelvis", "Legs", "Feet",
];

export default function PainDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Where does it hurt?</Text>

      <View style={styles.grid}>
        {bodyParts.map((part) => (
          <Pressable key={part} style={styles.card}>
            <Text style={styles.icon}>⚡</Text>
            <Text style={styles.label}>{part}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: "#f6f6f6",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});
