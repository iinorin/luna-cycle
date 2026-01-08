import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  Animated,
  Easing,
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
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  // Breathing effect loop for the center glow
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.2,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const currentPhase: CyclePhase = getPhaseForDay(currentDay, periodLength) ?? "luteal";
  const activeColor = PHASE_COLORS[currentPhase];

  const handleDayPress = (day: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDay(day);
    
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
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
      
      <View style={styles.ringStack}>
        
        {/* 🌬️ ANIMATED BREATHING GLOW */}
        <Animated.View 
          style={[
            styles.ambientGlow, 
            { 
              backgroundColor: activeColor, 
              shadowColor: activeColor, 
              transform: [{ scale: Animated.multiply(scaleAnim, breatheAnim) }] 
            }
          ]} 
        />

        {/* TOUCH LAYER */}
        <View {...panResponder.panHandlers} style={styles.touchLayer}>
          <View style={styles.glassRing}>
            <BlurView intensity={15} tint="light" style={StyleSheet.absoluteFill} />
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

        {/* 💎 NEW BIGGER, LIGHTER CENTER CIRCLE */}
        <View style={styles.centerLock} pointerEvents="none">
           <Animated.View style={[styles.innerCircle, { transform: [{ scale: scaleAnim }] }]}>
              <BlurView intensity={40} tint="light" style={styles.innerCircleBlur} />
              
              <Text style={styles.labelTitle}>CURRENTLY IN</Text>
              <Text style={[styles.phaseText, { color: activeColor }]}>
                {currentPhase}
              </Text>
              
              <View style={[styles.dayContainer, { borderColor: activeColor }]}>
                <Text style={styles.dayText}>Day {currentDay}</Text>
              </View>
           </Animated.View>
        </View>
      </View>

      {/* TIP CARD */}
      {selectedDay !== null && (
        <View style={styles.tipWrapper}>
          <BlurView intensity={80} tint="dark" style={styles.tipGlass}>
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
    width: RING_SIZE + 80,
    height: RING_SIZE + 80,
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
    width: RING_SIZE * 0.75,
    height: RING_SIZE * 0.75,
    borderRadius: 1000,
    opacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 20,
  },
  glassRing: {
    width: RING_SIZE + 40,
    height: RING_SIZE + 40,
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    position: "absolute",
  },
  rimLightTop: {
    position: "absolute",
    top: 0, width: '100%', height: '50%',
    borderTopWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1000,
  },
  rimLightBottom: {
    position: "absolute",
    bottom: 0, width: '100%', height: '50%',
    borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1000,
  },
  centerLock: {
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: RING_SIZE * 0.65,
    height: RING_SIZE * 0.65,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  innerCircleBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  labelTitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 2,
  },
  phaseText: {
    fontSize: 32,
    fontWeight: "900",
    textTransform: 'capitalize',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  dayContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dayText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
  tipWrapper: {
    width: width - 40,
    marginTop: 30,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tipGlass: { flexDirection: 'row', padding: 22 },
  tipAccent: { width: 5, borderRadius: 10, height: '100%', marginRight: 15 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  dotWrapper: { position: "absolute", alignItems: "center", justifyContent: "center" },
  activeHalo: {
    position: "absolute",
    width: ACTIVE_DOT_SIZE + 14,
    height: ACTIVE_DOT_SIZE + 14,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.6,
  },
});