import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";

type BleedingRowProps = {
  day: number;
};

export default function BleedingRow({ day }: BleedingRowProps) {
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bleeding – Day {day}</Text>

      <View style={styles.row}>
        {(["None", "Light", "Medium", "Heavy"] as const).map((label, index) => {
          const isActive = level === index;

          return (
            <Pressable
              key={label}
              onPress={() => setLevel(index as 0 | 1 | 2 | 3)}
              style={[
                styles.button,
                isActive && styles.activeButton,
              ]}
            >
              <Text style={styles.text}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    color: "#E5E7EB",
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  activeButton: {
    backgroundColor: "rgba(239,68,68,0.35)",
  },
  text: {
    color: "#E5E7EB",
    fontSize: 13,
  },
});
