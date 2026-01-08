import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  ColorValue,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { CycleDot } from "./CycleDots";
import { DayInfoCard } from "./DayInfoCard";
import { getPhaseForDay } from "@/src/cycle/state";
import { CyclePhase } from "@/src/cycle/types";

type Props = {
  cycleLength: number;
  periodLength: number;
  currentDay: number;
};

const { width } = Dimensions.get("window");
const RING_SIZE = width * 0.7; // Responsive sizing
const DOT_RADIUS = RING_SIZE / 2;
const DOT_SIZE = 12;
const ACTIVE_DOT_SIZE = 22;

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#F472B6", // Pink
  follicular: "#5EEAD4", // Teal
  ovulation: "#FBBF24", // Gold
  safe: "#38BDF8",      // Sky Blue
  luteal: "#A78BFA",    // Lavender
};

export function CycleRing({ cycleLength, periodLength, currentDay }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const currentPhase: CyclePhase = getPhaseForDay(currentDay, periodLength) ?? "luteal";
  const activeColor = PHASE_COLORS[currentPhase];

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) setOffset((p) => p + cycleLength);
      if (g.dx > 50) setOffset((p) => Math.max(0, p - cycleLength));
    },
  });

  return (
    <View style={styles.wrapper}>
      
      {/* 1. BACKGROUND AMBIENT GLOW */}
      {/* This creates the soft "light bleed" behind the glass */}
      <View style={[styles.ambientGlow, { backgroundColor: activeColor, shadowColor: activeColor }]} />

      <View {...panResponder.panHandlers} style={styles.container}>
        
        {/* 2. THE GLASS DISK (The Frosted Ring) */}
        <View style={styles.glassDisk}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          
          {/* Inner Rim Light for 3D depth */}
          <View style={styles.rimLight} />
          
          {/* Subtle Path for the dots */}
          <View style={styles.dashedTrack} />
        </View>

        {/* 3. CENTER CONTENT CARD (Floating above the glass) */}
        <View style={styles.centerCard}>
          <Text style={styles.centerSmall}>CURRENT PHASE</Text>
          <Text style={styles.centerBig}>{currentPhase.toUpperCase()}</Text>
          
          <LinearGradient
            colors={[activeColor, activeColor + 'CC']}
            style={styles.dayBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.dayText}>Day {currentDay}</Text>
          </LinearGradient>
        </View>

        {/* 4. THE DOTS SYSTEM */}
        {Array.from({ length: cycleLength }).map((_, i) => {
          const day = i + 1 + offset;
          const angle = (2 * Math.PI * i) / cycleLength - Math.PI / 2;

          // Adjust X and Y to center dots on the ring path
          const x = RING_SIZE / 2 + DOT_RADIUS * Math.cos(angle) - (day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE) / 2;
          const y = RING_SIZE / 2 + DOT_RADIUS * Math.sin(angle) - (day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE) / 2;

          const phase: CyclePhase = getPhaseForDay(day, periodLength) ?? "luteal";

          return (
            <View
              key={i}
              style={[styles.dotWrapper, { left: x, top: y }]}
              onTouchEnd={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedDay(day);
              }}
            >
              <CycleDot
                phase={phase}
                isActive={day === currentDay}
                size={day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE}
              />
              {day === currentDay && <View style={[styles.activeHalo, { borderColor: activeColor }]} />}
            </View>
          );
        })}
      </View>

      {/* 5. SELECTION INFO */}
      {selectedDay !== null && (
        <DayInfoCard day={selectedDay} periodLength={periodLength} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  ambientGlow: {
    position: "absolute",
    width: RING_SIZE * 0.8,
    height: RING_SIZE * 0.8,
    borderRadius: RING_SIZE,
    opacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 20, // Android glow fallback
  },
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  glassDisk: {
    width: RING_SIZE + 60,
    height: RING_SIZE + 60,
    borderRadius: (RING_SIZE + 60) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    position: "absolute",
  },
  rimLight: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    borderRadius: RING_SIZE,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  dashedTrack: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderStyle: "dashed",
    top: 30,
    left: 30,
  },
  centerCard: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#0F172A", // Dark slate background
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  centerSmall: {
    color: "rgba(148, 163, 184, 0.8)",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  centerBig: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },
  dayBadge: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  dotWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  activeHalo: {
    position: "absolute",
    width: ACTIVE_DOT_SIZE + 12,
    height: ACTIVE_DOT_SIZE + 12,
    borderRadius: (ACTIVE_DOT_SIZE + 12) / 2,
    borderWidth: 2,
    opacity: 0.5,
  },
});