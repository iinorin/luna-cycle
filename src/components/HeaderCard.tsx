import { View, Text, StyleSheet } from "react-native";

export function HeaderCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Luna Cycle</Text>
      <Text style={styles.subtitle}>
        Track your cycle • Understand your body
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#00C9B7",
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 22,
    width: "90%",
    alignItems: "center",
    marginBottom: 32,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#EFFFFC",
  },
});
