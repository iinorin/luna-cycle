import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  Animated,
  ColorValue,
} from "react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { CycleDot } from "./CycleDots";
import { DayInfoCard } from "./DayInfoCard";
import { getPhaseForDay } from "@/src/cycle/state";
import { CyclePhase } from "@/src/cycle/types";

// 1. FIXED: Added the missing Props type definition
type Props = {
  cycleLength: number;
  periodLength: number;
  currentDay: number;
};

const { width } = Dimensions.get("window");
const RING_SIZE = width * 0.75;
const DOT_RADIUS = RING_SIZE / 2;
const DOT_SIZE = 12;
const ACTIVE_DOT_SIZE = 22;

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: "#F472B6",
  follicular: "#5EEAD4",
  ovulation: "#FBBF24",
  safe: "#38BDF8",
  luteal: "#A78BFA",
};

export function CycleRing({ cycleLength, periodLength, currentDay }: Props) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  
  // Animation for the 3D pulse effect on touch
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentPhase: CyclePhase = getPhaseForDay(currentDay, periodLength) ?? "luteal";
  const activeColor = PHASE_COLORS[currentPhase];

  const handleDayPress = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDay(day);
    
    // Trigger 3D feedback animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 100, useNativeDriver: true }),
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
      {/* AMBIENT GLOW (Behind the glass) */}
      <Animated.View 
        style={[
          styles.ambientGlow, 
          { backgroundColor: activeColor, shadowColor: activeColor, transform: [{ scale: scaleAnim }] }
        ]} 
      />

      <View {...panResponder.panHandlers} style={styles.container}>
        
        {/* 🧊 3D GLASS DISK */}
        <View style={styles.glassRing}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.rimLightTop} />
          <View style={styles.rimLightBottom} />
        </View>

        {/* CENTER CONTENT (Floating/Transparent) */}
        <Animated.View style={[styles.centerContent, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.centerSmall}>CURRENT PHASE</Text>
          <Text style={[styles.centerBig, { color: activeColor }]}>
            {currentPhase.toUpperCase()}
          </Text>
          <View style={styles.dayIndicator}>
            <Text style={styles.dayText}>Day {currentDay}</Text>
          </View>
        </Animated.View>

        {/* DOTS SYSTEM */}
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

      {/* 🃏 UPGRADED TIP CARD (More visible title and 3D feel) */}
      {selectedDay !== null && (
        <View style={styles.tipWrapper}>
          <BlurView intensity={50} tint="dark" style={styles.tipGlass}>
            <View style={[styles.tipAccent, { backgroundColor: activeColor }]} />
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: activeColor }]}>
                Day {selectedDay} Insight
              </Text>
              <DayInfoCard day={selectedDay} periodLength={periodLength} />
            </View>
          </BlurView>
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
    opacity: 0.35,
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
    top: 0, 
    width: '100%', 
    height: '50%',
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: (RING_SIZE + 50) / 2,
  },
  // FIXED: Added the missing rimLightBottom property
  rimLightBottom: {
    position: "absolute",
    bottom: 0, 
    width: '100%', 
    height: '50%',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: (RING_SIZE + 50) / 2,
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
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  dayIndicator: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dayText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "800",
  },
  tipWrapper: {
    width: width - 40,
    marginTop: 40,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  tipGlass: {
    flexDirection: 'row',
    padding: 24,
  },
  tipAccent: {
    width: 5,
    borderRadius: 10,
    height: '100%',
    marginRight: 18,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  dotWrapper: { 
    position: "absolute", 
    alignItems: "center", 
    justifyContent: "center" 
  },
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