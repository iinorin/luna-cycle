import { View, Text, StyleSheet } from "react-native";
import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function TrackCard({ title, children }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
});
