import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { EnergyLevel } from "./energyTypes";
import { loadTodayEnergy } from "./energyStorage";

const { width } = Dimensions.get("window");

const ENERGY_META: Record<
  number,
  { label: string; percent: number; color: string; message: string }
> = {
  1: {
    label: "CRITICAL",
    percent: 20,
    color: "#ef4444",
    message: "Time to recharge and rest.",
  },
  2: {
    label: "LOW",
    percent: 40,
    color: "#f97316",
    message: "Take it easy today.",
  },
  3: {
    label: "BALANCED",
    percent: 60,
    color: "#facc15",
    message: "You're in a steady flow.",
  },
  4: {
    label: "HIGH",
    percent: 80,
    color: "#84cc16",
    message: "Productivity is your friend.",
  },
  5: {
    label: "FULL",
    percent: 100,
    color: "#22c55e",
    message: "You are unstoppable today!",
  },
};

export default function EnergySuccess() {
  const router = useRouter();
  const [level, setLevel] = useState<EnergyLevel | null>(null);

  useEffect(() => {
    loadTodayEnergy().then((entry) => {
      if (entry?.level) {
        setLevel(entry.level as EnergyLevel);
      }
    });
  }, []);

  if (!level) return null;

  const meta = ENERGY_META[level];

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(drawer)/(tabs)/cycle");
  };

  const handleEdit = () => {
    Haptics.selectionAsync();
    router.replace("./(drawer)/(tabs)/energyBar");
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.container}>
        <View style={styles.card}>
          {/* TOP BADGE */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VIBE CAPTURED ✨</Text>
          </View>

          <Text style={styles.title}>Energy Level</Text>

          {/* PERCENT */}
          <View style={styles.percentContainer}>
            <Text style={[styles.percentText, { color: meta.color }]}>
              {meta.percent}
              <Text style={styles.percentSymbol}>%</Text>
            </Text>
          </View>

          <Text style={[styles.statusLabel, { color: meta.color }]}>
            {meta.label}
          </Text>

          <Text style={styles.message}>{meta.message}</Text>

          {/* BARS */}
          <View style={styles.barRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  { backgroundColor: i <= level ? meta.color : "#e2e8f0" },
                  i <= level && styles.activeBarShadow,
                ]}
              />
            ))}
          </View>

          {/* BUTTONS */}
          <TouchableOpacity style={styles.primaryBtn} onPress={handleHome}>
            <Text style={styles.primaryText}>Back to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleEdit}>
            <Text style={styles.secondaryText}>Edit Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 42,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  badge: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginBottom: 25,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
  },
  percentContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  percentText: {
    fontSize: 88,
    fontWeight: "900",
    letterSpacing: -4,
  },
  percentSymbol: {
    fontSize: 32,
    fontWeight: "700",
  },
  statusLabel: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: -10,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 35,
    fontWeight: "500",
  },
  barRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 40,
  },
  bar: {
    width: 14,
    height: 50,
    borderRadius: 10,
  },
  activeBarShadow: {
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtn: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 20,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryBtn: {
    paddingVertical: 10,
  },
  secondaryText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
