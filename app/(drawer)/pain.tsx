import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import {
  Activity,
  Brain,
  Flame,
  HeartPulse,
  Waves,
} from "lucide-react-native";

type PainType = {
  id: string;
  label: string;
  icon: any;
  color: string;
};

const PAINS: PainType[] = [
  {
    id: "cramps",
    label: "Period Cramps",
    icon: Flame,
    color: "#F87171",
  },
  {
    id: "headache",
    label: "Headache",
    icon: Brain,
    color: "#60A5FA",
  },
  {
    id: "back",
    label: "Lower Back Pain",
    icon: Activity,
    color: "#A78BFA",
  },
  {
    id: "ovulation",
    label: "Ovulation Pain",
    icon: Waves,
    color: "#34D399",
  },
  {
    id: "body",
    label: "Body Ache",
    icon: HeartPulse,
    color: "#FB923C",
  },
];

export default function PainScreen() {
  const [painLevels, setPainLevels] = useState<Record<string, number>>(
    PAINS.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
  );

  const updatePain = (id: string, delta: number) => {
    setPainLevels((prev) => ({
      ...prev,
      [id]: Math.min(10, Math.max(0, prev[id] + delta)),
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pain Tracker</Text>
      <Text style={styles.subtitle}>
        Track intensity of pain throughout your cycle
      </Text>

      {PAINS.map((pain) => (
        <PainCard
          key={pain.id}
          pain={pain}
          value={painLevels[pain.id]}
          onIncrease={() => updatePain(pain.id, 1)}
          onDecrease={() => updatePain(pain.id, -1)}
        />
      ))}
    </View>
  );
}

function PainCard({
  pain,
  value,
  onIncrease,
  onDecrease,
}: {
  pain: PainType;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const progress = useSharedValue(value * 10);

  progress.value = withTiming(value * 10, { duration: 300 });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: pain.color + "20" },
          ]}
        >
          <pain.icon size={22} color={pain.color} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{pain.label}</Text>
          <Text style={styles.level}>Intensity: {value}/10</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: `${value * 10}%`,
              backgroundColor: pain.color,
            },
          ]}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable style={styles.btn} onPress={onDecrease}>
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={onIncrease}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    color: "#64748B",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#020617",
  },
  level: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  barBg: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  btnText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F172A",
  },
});
