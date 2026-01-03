import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";
import { CyclePhase } from "@/src/cycle/types";

type Props = {
  phase: CyclePhase;
  day: number;
};

const NIGHT_START = 22;
const NIGHT_END = 6;

/* 🧍‍♀️ MULTI-IMAGE SUPPORT */
const PHASE_IMAGES: Record<CyclePhase | "night", any[]> = {
  menstrual: [
    require("@/assets/companion/menstrual_1.png"),
    require("@/assets/companion/menstrual_2.png"),
  ],
  follicular: [
    require("@/assets/companion/follicular_1.png"),
    require("@/assets/companion/follicular_2.png"),
  ],
  ovulation: [
    require("@/assets/companion/ovulation_1.png"),
    require("@/assets/companion/ovulation_2.png"),
  ],
  safe: [
    require("@/assets/companion/safe_1.png"),
    require("@/assets/companion/safe_2.png"),
  ],
  luteal: [
    require("@/assets/companion/luteal_1.png"),
    require("@/assets/companion/luteal_2.png"),
  ],
  night: [
    require("@/assets/companion/sleep.png"),
  ],
};

/* 💬 COMPANION MESSAGES */
const MESSAGES: Record<CyclePhase | "night", string[]> = {
  menstrual: [
    "It’s okay to slow down today 🤍",
    "You don’t need to be strong today",
    "Rest is part of healing 🌙",
  ],
  follicular: [
    "You’re slowly feeling lighter 🌱",
    "New energy is building up",
    "Curious thoughts today?",
  ],
  ovulation: [
    "You’re glowing today ✨",
    "Confidence looks good on you",
    "Feeling social or bold?",
  ],
  safe: [
    "Things feel calm today 🌿",
    "A peaceful day suits you",
    "How are you feeling right now?",
  ],
  luteal: [
    "Be gentle with yourself 💜",
    "Emotions might feel heavier",
    "You’re allowed to rest",
  ],
  night: [
    "Good night 🌙 sweet dreams",
    "You did enough today 🤍",
    "Rest well, I’m here",
  ],
};

export function CompanionMessage({ phase, day }: Props) {
  const hour = new Date().getHours();
  const isNight = hour >= NIGHT_START || hour < NIGHT_END;
  const activePhase: CyclePhase | "night" = isNight ? "night" : phase;

  /* 🖼️ Rotate image + message by day (stable, no flicker) */
  const image = useMemo(() => {
    const list = PHASE_IMAGES[activePhase];
    return list[day % list.length];
  }, [activePhase, day]);

  const message = useMemo(() => {
    const list = MESSAGES[activePhase];
    return list[day % list.length];
  }, [activePhase, day]);

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={42} tint="dark" style={styles.card}>
        {/* 🧍‍♀️ Companion */}
        <Image source={image} style={styles.girl} />

        {/* 💭 Speech Bubble */}
        <View style={styles.bubble}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 22,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    minHeight: 150,
  },

  girl: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    marginRight: 16,
  },

  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderTopLeftRadius: 10,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "500",
  },
});
