import { View, StyleSheet } from "react-native";

export default function TrackCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
  },
});
