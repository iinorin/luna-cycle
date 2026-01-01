import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
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
const DOT_RADIUS = 110;

// ✅ DOT SIZE CONTROLS
const DOT_SIZE = 18;
const ACTIVE_DOT_SIZE = 26;

export function CycleRing({
  cycleLength,
  periodLength,
  currentDay,
}: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) setOffset((p) => p + cycleLength);
      if (g.dx > 50) setOffset((p) => Math.max(0, p - cycleLength));
    },
  });

  return (
    <View style={styles.wrapper}>
      {/* GRADIENT GLOW */}
      <LinearGradient
        colors={["rgba(99,102,241,0.25)", "rgba(15,23,42,0.9)"]}
        style={styles.ringGlow}
      >
        {/* RING */}
        <View {...panResponder.panHandlers} style={styles.container}>
          {/* CENTER LABEL */}
          <View style={styles.centerLabel}>
            <Text style={styles.centerSmall}>Today</Text>
            <Text style={styles.centerBig}>
              {getPhaseForDay(currentDay, periodLength)} Phase
            </Text>
          </View>

          {Array.from({ length: cycleLength }).map((_, i) => {
            const day = i + 1 + offset;
            const angle =
              (2 * Math.PI * i) / cycleLength - Math.PI / 2;

            const x =
              RING_SIZE / 2 + DOT_RADIUS * Math.cos(angle) - 8;
            const y =
              RING_SIZE / 2 + DOT_RADIUS * Math.sin(angle) - 8;

            const phase = getPhaseForDay(day, periodLength);

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
                  size={day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE}
                />
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* INFO CARD */}
      {selectedDay && (
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
    width: RING_SIZE + 40,
    height: RING_SIZE + 40,
    borderRadius: (RING_SIZE + 40) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  dotWrapper: {
    position: "absolute",
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  centerSmall: {
    color: "#CBD5F5",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  centerBig: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 2,
  },
});
