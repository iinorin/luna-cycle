import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type CyclePhase =
  | "menstrual"
  | "follicular"
  | "ovulation"
  | "luteal"
  | "safe";

interface ThemeConfig {
  readonly colors: readonly [string, string];
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface TipsSuggesterProps {
  phase: CyclePhase;
  currentDay: number;
}

const PHASE_THEMES: Record<CyclePhase, ThemeConfig> = {
  menstrual: {
    colors: ["#F472B6", "#9D174D"],
    icon: "water-outline",
    label: "Self-Care",
  },
  follicular: {
    colors: ["#5EEAD4", "#0D9488"],
    icon: "flash-outline",
    label: "Energy",
  },
  ovulation: {
    colors: ["#FBBF24", "#B45309"],
    icon: "heart-outline",
    label: "Social",
  },
  luteal: {
    colors: ["#A78BFA", "#5B21B6"],
    icon: "moon-outline",
    label: "Rest",
  },
  safe: {
    colors: ["#38BDF8", "#0369A1"],
    icon: "shield-checkmark-outline",
    label: "Stable",
  },
};

export function TipsSuggester({ phase, currentDay }: TipsSuggesterProps) {
  const theme = PHASE_THEMES[phase] || PHASE_THEMES.luteal;

  return (
    <View style={styles.container}>
      {/* Floating Card */}
      <BlurView intensity={22} tint="dark" style={styles.card}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <LinearGradient
              colors={theme.colors}
              style={styles.iconBox}
            >
              <Ionicons name={theme.icon} size={18} color="#fff" />
            </LinearGradient>

            <View>
              <Text style={[styles.tag, { color: theme.colors[0] }]}>
                {theme.label.toUpperCase()} INSIGHT
              </Text>
              <Text style={styles.day}>Day {currentDay}</Text>
            </View>
          </View>

          {/* Body */}
          <Text style={styles.tipText}>
            Your {phase} energy is rising. Perfect for focused work,
            movement, and creative thinking.
          </Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  /* Push card DOWN from header */
  container: {
    marginTop: 32,          // 🔑 MAIN FIX
    marginBottom: 24,
    alignItems: "center",
    width: "100%",
  },

  /* Floating card */
  card: {
    width: "92%",           // Not full width = card feel
    borderRadius: 22,
    overflow: "hidden",

    backgroundColor: "rgba(15, 23, 42, 0.55)",

    /* Real elevation */
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  content: {
    padding: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  tag: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  day: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginTop: 2,
  },

  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },
});
