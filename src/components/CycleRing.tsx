import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  ColorValue,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { CycleDot } from "./CycleDots";
import { DayInfoCard } from "./DayInfoCard";
import { getPhaseForDay } from "@/src/cycle/state";

type Props = {
  cycleLength: number;
  periodLength: number;
  currentDay: number;
};

const RING_SIZE = 260;
const DOT_RADIUS = 112;
const DOT_SIZE = 16;
const ACTIVE_DOT_SIZE = 24;

/* 🌿 Phase glow gradients */
const PHASE_GLOW: Record<
  string,
  readonly [ColorValue, ColorValue, ...ColorValue[]]
> = {
  period: ["rgba(244,114,182,0.32)", "rgba(15,23,42,0.96)"],
  follicular: ["rgba(94,234,212,0.32)", "rgba(15,23,42,0.96)"],
  ovulation: ["rgba(251,191,36,0.38)", "rgba(15,23,42,0.96)"],
  luteal: ["rgba(167,139,250,0.32)", "rgba(15,23,42,0.96)"],
};

/* 🛡️ ABSOLUTE FALLBACK (never crashes) */
const FALLBACK_GLOW: readonly [ColorValue, ColorValue] = [
  "rgba(148,163,184,0.25)",
  "rgba(15,23,42,0.95)",
];

export function CycleRing({
  cycleLength,
  periodLength,
  currentDay,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const currentPhase =
    getPhaseForDay(currentDay, periodLength) ?? "luteal";

  /* ✅ SAFE gradient selection */
  const ringGlowColors =
    PHASE_GLOW[currentPhase] ?? FALLBACK_GLOW;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) setOffset((p) => p + cycleLength);
      if (g.dx > 50) setOffset((p) => Math.max(0, p - cycleLength));
    },
  });

  return (
    <View style={styles.wrapper}>
      {/* 🌫️ PHASE GLOW RING */}
      <LinearGradient
        colors={ringGlowColors}
        start={{ x: 0.2, y: 0.15 }}
        end={{ x: 0.85, y: 0.9 }}
        style={styles.ringGlow}
      >
        <View style={styles.innerGlow} />

        <View {...panResponder.panHandlers} style={styles.container}>
          {/* CENTER LABEL */}
          <View style={styles.centerLabel}>
            <Text style={styles.centerSmall}>Today</Text>
            <Text style={styles.centerBig}>
              {currentPhase.charAt(0).toUpperCase() +
                currentPhase.slice(1)}{" "}
              Phase
            </Text>
          </View>

          {Array.from({ length: cycleLength }).map((_, i) => {
            const day = i + 1 + offset;
            const angle =
              (2 * Math.PI * i) / cycleLength - Math.PI / 2;

            const x =
              RING_SIZE / 2 +
              DOT_RADIUS * Math.cos(angle) -
              DOT_SIZE / 2;
            const y =
              RING_SIZE / 2 +
              DOT_RADIUS * Math.sin(angle) -
              DOT_SIZE / 2;

            const phase =
              getPhaseForDay(day, periodLength) ?? "luteal";

            return (
              <View
                key={i}
                style={[styles.dotWrapper, { left: x, top: y }]}
                onTouchEnd={() => {
                  Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Light
                  );
                  setSelectedDay(day);
                }}
              >
                <CycleDot
                  phase={phase}
                  isActive={day === currentDay}
                  size={
                    day === currentDay
                      ? ACTIVE_DOT_SIZE
                      : DOT_SIZE
                  }
                />
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* INFO CARD */}
      {selectedDay !== null && (
        <DayInfoCard
          day={selectedDay}
          periodLength={periodLength}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },

  ringGlow: {
    width: RING_SIZE + 44,
    height: RING_SIZE + 44,
    borderRadius: (RING_SIZE + 44) / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  innerGlow: {
    position: "absolute",
    width: RING_SIZE + 10,
    height: RING_SIZE + 10,
    borderRadius: (RING_SIZE + 10) / 2,
    backgroundColor: "rgba(255,255,255,0.035)",
  },

  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  dotWrapper: {
    position: "absolute",
  },

  centerLabel: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  centerSmall: {
    color: "#CBD5E1",
    fontSize: 12,
    letterSpacing: 0.4,
  },

  centerBig: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
});
