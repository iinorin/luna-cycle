import { View, Text, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  day: number;
  phase: string;
};

export function CycleTooltip({ visible, day, phase }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Day {day} · {phase}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: -40,
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  text: {
    color: "#fff",
    fontSize: 13,
  },
});
