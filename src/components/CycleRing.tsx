import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  ColorValue,
  Dimensions,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { CycleDot } from "./CycleDots";
import { DayInfoCard } from "./DayInfoCard";
import { getPhaseForDay } from "@/src/cycle/state";
import { CyclePhase } from "@/src/cycle/types";

const { width } = Dimensions.get("window");
const RING_SIZE = width * 0.75;
const DOT_RADIUS = RING_SIZE / 2;
const DOT_SIZE = 12;
const ACTIVE_DOT_SIZE = 22;

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#F472B6", follicular: "#5EEAD4",
  ovulation: "#FBBF24", safe: "#38BDF8", luteal: "#A78BFA",
};

export function CycleRing({ cycleLength, periodLength, currentDay }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  
  // Animation for the "3D Pulse" on touch
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentPhase: CyclePhase = getPhaseForDay(currentDay, periodLength) ?? "luteal";
  const activeColor = PHASE_COLORS[currentPhase];

  const handleDayPress = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDay(day);
    
    // 3D Pop Animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 30,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -50) setOffset((p) => p + cycleLength);
      if (g.dx > 50) setOffset((p) => Math.max(0, p - cycleLength));
    },
  });

  return (
    <View style={styles.wrapper}>
      {/* 🌌 AMBIENT 3D GLOW (Behind everything) */}
      <Animated.View 
        style={[
          styles.ambientGlow, 
          { backgroundColor: activeColor, shadowColor: activeColor, transform: [{ scale: scaleAnim }] }
        ]} 
      />

      <View {...panResponder.panHandlers} style={styles.container}>
        
        {/* 🧊 THE 3D GLASS RING */}
        <View style={styles.glassRing}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.rimLightTop} />
          <View style={styles.rimLightBottom} />
        </View>

        {/* 🔘 CENTER CONTENT (Transparent/3D Layered) */}
        <Animated.View style={[styles.centerContent, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.centerSmall}>CURRENT PHASE</Text>
          <Text style={[styles.centerBig, { color: activeColor }]}>
            {currentPhase.toUpperCase()}
          </Text>
          <View style={styles.dayIndicator}>
            <Text style={styles.dayText}>Day {currentDay}</Text>
          </View>
        </Animated.View>

        {/* 🔮 DOTS SYSTEM */}
        {Array.from({ length: cycleLength }).map((_, i) => {
          const day = i + 1 + offset;
          const angle = (2 * Math.PI * i) / cycleLength - Math.PI / 2;
          const x = RING_SIZE / 2 + DOT_RADIUS * Math.cos(angle) - (day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE) / 2;
          const y = RING_SIZE / 2 + DOT_RADIUS * Math.sin(angle) - (day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE) / 2;
          const phase: CyclePhase = getPhaseForDay(day, periodLength) ?? "luteal";

          return (
            <View
              key={i}
              style={[styles.dotWrapper, { left: x, top: y }]}
              onTouchEnd={() => handleDayPress(day)}
            >
              <CycleDot
                phase={phase}
                isActive={day === currentDay}
                size={day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE}
              />
              {day === currentDay && (
                <View style={[styles.activeHalo, { borderColor: activeColor }]} />
              )}
            </View>
          );
        })}
      </View>

      {/* 🃏 IMPROVED TIP CARD (DayInfoCard) */}
      {selectedDay !== null && (
        <View style={styles.tipContainer}>
          <LinearGradient
            colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 1)']}
            style={styles.tipCard}
          >
            <View style={[styles.tipAccent, { backgroundColor: activeColor }]} />
            <DayInfoCard day={selectedDay} periodLength={periodLength} />
          </LinearGradient>
        </View>
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
    width: RING_SIZE * 0.7,
    height: RING_SIZE * 0.7,
    borderRadius: RING_SIZE,
    opacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
    elevation: 20,
  },
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  glassRing: {
    width: RING_SIZE + 50,
    height: RING_SIZE + 50,
    borderRadius: (RING_SIZE + 50) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    position: "absolute",
  },
  rimLightTop: {
    position: "absolute",
    top: 0, width: '100%', height: '50%',
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: RING_SIZE,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  centerSmall: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  centerBig: {
    fontSize: 28,
    fontWeight: "900",
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  dayIndicator: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dayText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  tipContainer: {
    marginTop: 40,
    width: width - 40,
    padding: 2,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)', // Outline
  },
  tipCard: {
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  tipAccent: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 6,
  },
  // Dot Styles...
  dotWrapper: { position: "absolute", alignItems: "center", justifyContent: "center" },
  activeHalo: {
    position: "absolute",
    width: ACTIVE_DOT_SIZE + 15,
    height: ACTIVE_DOT_SIZE + 15,
    borderRadius: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
});