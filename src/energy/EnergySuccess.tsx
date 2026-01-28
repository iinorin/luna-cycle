import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { EnergyLevel } from "./energyTypes";

const ENERGY_META: Record<EnergyLevel, { label: string; percent: number; color: string }> = {
  1: { label: "Critical", percent: 20, color: "#ef4444" },
  2: { label: "Low", percent: 40, color: "#f97316" },
  3: { label: "Balanced", percent: 60, color: "#facc15" },
  4: { label: "High", percent: 80, color: "#84cc16" },
  5: { label: "Full", percent: 100, color: "#22c55e" },
};

export default function EnergySuccess({
  level,
  onEdit,
  onHome,
}: {
  level: EnergyLevel;
  onEdit: () => void;
  onHome: () => void;
}) {
  const meta = ENERGY_META[level];

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>Energy Saved ✨</Text>

        {/* Percentage */}
        <Text style={[styles.percent, { color: meta.color }]}>
          {meta.percent}%
        </Text>

        <Text style={[styles.label, { color: meta.color }]}>
          {meta.label}
        </Text>

        {/* Bars */}
        <View style={styles.barRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  backgroundColor:
                    i <= level ? meta.color : "#334155",
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onHome}>
          <Text style={styles.primaryText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={onEdit}>
          <Text style={styles.secondaryText}>Edit Energy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0f0e0e",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "90%",
    backgroundColor: "#2c3946",
    borderRadius: 32,
    padding: 28,
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },

  percent: {
    fontSize: 64,
    fontWeight: "900",
    marginBottom: 8,
  },

  label: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
  },

  barRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },

  bar: {
    width: 18,
    height: 70,
    borderRadius: 10,
  },

  primaryBtn: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  secondaryBtn: {
    paddingVertical: 12,
  },

  secondaryText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
  },
});
