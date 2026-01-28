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
