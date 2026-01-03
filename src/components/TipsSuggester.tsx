import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
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

export function TipsSuggester({ phase, currentDay }: Props) {
  const tip = useMemo(() => {
    const tips = PHASE_TIPS[phase];
    return tips[currentDay % tips.length];
  }, [phase, currentDay]);

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={28} tint="dark" style={styles.container}>
        <Text style={styles.label}>Daily Tip</Text>
        <Text style={styles.tip}>{tip}</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 18,
  },

  container: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
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
    fontWeight: "500",
  },
});
