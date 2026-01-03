import React, { useMemo, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { CyclePhase } from "@/src/cycle/types";

type Props = {
  phase: CyclePhase;
  currentDay: number;
};

const PHASE_TIPS = {
  menstrual: [
    "Rest is productive today 🛌❤️",
    "Warm foods help cramps ☕🔥",
    "Gentle stretching helps 🧘‍♀️",
    "Drink more water 💧",
    "Low energy is normal 🐢",
    "Iron-rich foods help 🥬",
    "Take breaks guilt-free 🌿",
    "Heat therapy feels good ♨️",
    "Be kind to yourself 💕",
    "Comfort comes first 🌙",
  ],

  follicular: [
    "Energy is rising 🌱",
    "Great time to plan 📚",
    "Light workouts feel easy 🏃‍♀️",
    "Focus improves 🎯",
    "Eat fresh foods 🥗",
    "Creativity flows 🎨",
    "Social energy increases 🫶",
    "Skin may glow ✨",
    "Set intentions 📝",
    "Confidence builds 🌼",
  ],

  ovulation: [
    "Confidence peaks ✨🔥",
    "Great time to talk 🗣️",
    "Body feels strong 💪",
    "High-energy workouts rock 🏋️‍♀️",
    "Express yourself 💖",
    "Social plans shine 🥂",
    "Hair & skin glow ✨",
    "Trust instincts 🔮",
    "Hydrate well 💧",
    "Perfect for bonding 💕",
  ],

  safe: [
    "Your body feels balanced 🌿",
    "Stick to routines ⚖️",
    "Moderate workouts work 🚶‍♀️",
    "Clear mental state 🧠",
    "Maintain habits 🌱",
    "Emotions feel steady 💙",
    "Productivity flows 🛠️",
    "Self-care feels grounding 🛁",
    "Hydrate & nourish 💧",
    "Enjoy the calm 🌸",
  ],

  luteal: [
    "Slow down 🌙",
    "Finish tasks first ✅",
    "Cravings are normal 🍫",
    "Strong intuition 🔮",
    "Organizing feels good 🗂️",
    "Sleep matters 😴",
    "Gentle movement helps 🚶‍♀️",
    "Mood shifts are okay 🌬️",
    "Journaling helps 📓",
    "Prepare for rest 💜",
  ],
} as const;

/** ✅ Type-safe gradient colors */
const PHASE_GRADIENTS: Record<
  CyclePhase,
  readonly [string, string]
> = {
  menstrual: ["#FADADD", "#F472B6"],
  follicular: ["#E6F4EA", "#86EFAC"],
  ovulation: ["#FFF3C4", "#FACC15"],
  safe: ["#E0F2FE", "#38BDF8"],
  luteal: ["#EDE7F6", "#A78BFA"],
};

export function TipsSuggester({ phase, currentDay }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [phase]);

  const tip = useMemo(() => {
    const tips = PHASE_TIPS[phase];
    return tips[currentDay % tips.length];
  }, [phase, currentDay]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={PHASE_GRADIENTS[phase]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <BlurView intensity={22} tint="dark" style={styles.container}>
          <Text style={styles.label}>Daily Tip</Text>
          <Text style={styles.tip}>{tip}</Text>
        </BlurView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 18,
  },

  gradient: {
    borderRadius: 22,
    padding: 1,
  },

  container: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  label: {
    fontSize: 12,
    color: "#CBD5E1",
    letterSpacing: 0.4,
    marginBottom: 6,
  },

  tip: {
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 22,
    fontWeight: "600",
  },
});
