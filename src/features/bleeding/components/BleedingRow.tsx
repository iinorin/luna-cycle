import { View, Text, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { Droplet } from "lucide-react-native";

type BleedingRowProps = {
  day: number;
};

const LEVELS = [
  { label: "None", drops: 0 },
  { label: "Light", drops: 1 },
  { label: "Medium", drops: 2 },
  { label: "Heavy", drops: 3 },
];

export default function BleedingRow({ day }: BleedingRowProps) {
  const [level, setLevel] = useState<number>(0);

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>🩸 Bleeding</Text>
        <Text style={styles.subtitle}>Day {day}</Text>

        <View style={styles.row}>
          {LEVELS.map((item, index) => {
            const isActive = level === index;

            return (
              <Pressable
                key={item.label}
                onPress={() => setLevel(index)}
                style={[
                  styles.option,
                  isActive && styles.activeOption,
                ]}
              >
                <View style={styles.drops}>
                  {Array.from({ length: item.drops }).map((_, i) => (
                    <Droplet
                      key={i}
                      size={16}
                      color={isActive ? "#F43F5E" : "#9CA3AF"}
                      fill={isActive ? "#F43F5E" : "transparent"}
                    />
                  ))}
                </View>

                <Text
                  style={[
                    styles.label,
                    isActive && styles.activeLabel,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginTop: 24,
  },

  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FEE2E2",
  },

  subtitle: {
    fontSize: 13,
    color: "#CBD5F5",
    marginBottom: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  activeOption: {
    backgroundColor: "rgba(244,63,94,0.18)",
    shadowColor: "#F43F5E",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },

  drops: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 2,
  },

  label: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  activeLabel: {
    color: "#FEE2E2",
    fontWeight: "600",
  },
});
