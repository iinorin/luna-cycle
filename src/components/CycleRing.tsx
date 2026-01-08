import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

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
const RING_SIZE = width * 0.72;
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
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentPhase: CyclePhase = getPhaseForDay(currentDay, periodLength) ?? "luteal";
  const activeColor = PHASE_COLORS[currentPhase];

  const handleDayPress = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDay(day);
    
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
      
      {/* 🌌 THE RING STACK */}
      <View style={styles.ringStack}>
        
        {/* BACKGROUND GLOW - Locked and clipped */}
        <Animated.View 
          style={[
            styles.ambientGlow, 
            { backgroundColor: activeColor, shadowColor: activeColor, transform: [{ scale: scaleAnim }] }
          ]} 
        />

        {/* TOUCH AREA - The Ring and Dots */}
        <View {...panResponder.panHandlers} style={styles.touchLayer}>
          <View style={styles.glassRing}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.rimLightTop} />
            <View style={styles.rimLightBottom} />
          </View>

          {Array.from({ length: cycleLength }).map((_, i) => {
            const day = i + 1 + offset;
            const angle = (2 * Math.PI * i) / cycleLength - Math.PI / 2;
            const x = DOT_RADIUS + DOT_RADIUS * Math.cos(angle) - (day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE) / 2;
            const y = DOT_RADIUS + DOT_RADIUS * Math.sin(angle) - (day === currentDay ? ACTIVE_DOT_SIZE : DOT_SIZE) / 2;
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
                {day === currentDay && <View style={[styles.activeHalo, { borderColor: activeColor }]} />}
              </View>
            );
          })}
        </View>

        {/* 🔒 FIXED CENTER - Positioned absolutely so it NEVER moves */}
        <View style={styles.centerLock} pointerEvents="none">
           <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
              <Text style={styles.centerSmall}>PHASE</Text>
              <Text style={[styles.centerBig, { color: activeColor }]}>
                {currentPhase.toUpperCase()}
              </Text>
              <View style={styles.dayBadge}>
                <Text style={styles.dayText}>Day {currentDay}</Text>
              </View>
           </Animated.View>
        </View>
      </View>

      {/* 🃏 TIP CARD */}
      {selectedDay !== null && (
        <View style={styles.tipWrapper}>
          <BlurView intensity={60} tint="dark" style={styles.tipGlass}>
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
    paddingVertical: 20,
  },
  ringStack: {
    width: RING_SIZE + 60,
    height: RING_SIZE + 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchLayer: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  ambientGlow: {
    position: "absolute",
    width: RING_SIZE * 0.6,
    height: RING_SIZE * 0.6,
    borderRadius: 1000,
    opacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 20,
  },
  glassRing: {
    width: RING_SIZE + 40,
    height: RING_SIZE + 40,
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    overflow: "hidden",
    position: "absolute",
  },
  rimLightTop: {
    position: "absolute",
    top: 0, width: '100%', height: '50%',
    borderTopWidth: 2, borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 1000,
  },
  rimLightBottom: {
    position: "absolute",
    bottom: 0, width: '100%', height: '50%',
    borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 1000,
  },
  centerLock: {
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSmall: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
  centerBig: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  dayBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dayText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  tipWrapper: {
    width: width - 40,
    marginTop: 40,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tipGlass: { flexDirection: 'row', padding: 22 },
  tipAccent: { width: 4, borderRadius: 10, height: '100%', marginRight: 15 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginBottom: 8, textTransform: 'uppercase' },
  dotWrapper: { position: "absolute", alignItems: "center", justifyContent: "center" },
  activeHalo: {
    position: "absolute",
    width: ACTIVE_DOT_SIZE + 14,
    height: ACTIVE_DOT_SIZE + 14,
    borderRadius: 100,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
});