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
        <Text style={styles.title}>Bleeding</Text>
        <Text style={styles.subtitle}>Today • Day {day}</Text>

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
                <View style={styles.iconRow}>
                  {Array.from({ length: item.drops }).map((_, i) => (
                    <Droplet
                      key={i}
                      size={18}
                      color={isActive ? "#F43F5E" : "#9CA3AF"}
                      fill={isActive ? "#F43F5E" : "transparent"}
                    />
                  ))}
                </View>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
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
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FEE2E2",
  },

  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  option: {
    width: 72,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#0F172A",
  },

  activeOption: {
    backgroundColor: "rgba(244,63,94,0.2)",
    shadowColor: "#F43F5E",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  iconRow: {
    flexDirection: "row",
    marginBottom: 6,
    minHeight: 22,
  },

  label: {
    fontSize: 12,
    color: "#CBD5F5",
    textAlign: "center",
  },

  activeLabel: {
    color: "#FEE2E2",
    fontWeight: "600",
  },
});
