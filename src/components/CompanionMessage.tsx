import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CyclePhase } from "@/src/cycle/types";

type Props = {
  phase: CyclePhase;
};

/* 🧠 Phase messages (emotional, not tips) */
const PHASE_MESSAGES: Record<CyclePhase, string[]> = {
  menstrual: [
    "Hey… how are you feeling today? 🩸💗",
    "It’s okay to slow down today 🤍",
    "I’m right here with you 🌸",
  ],
  follicular: [
    "You seem lighter today 🌱",
    "Feeling a bit more motivated?",
    "This energy looks good on you ✨",
  ],
  ovulation: [
    "You’re glowing today ✨",
    "You feel confident — I can tell 💕",
    "Smile… today suits you 🌸",
  ],
  safe: [
    "Everything feels balanced today 🌿",
    "You’re doing just fine 🤍",
    "Let’s enjoy this calm energy 🫶",
  ],
  luteal: [
    "Hey… be gentle with yourself 🌙",
    "Your feelings matter 🤍",
    "It’s okay to rest your mind 💭",
  ],
};

/* 👧 Phase-based girl images (2 each) */
const PHASE_IMAGES: Record<CyclePhase, any[]> = {
  menstrual: [
    require("../../assets/companion/menstrual_1.png"),
    require("../../assets/companion/menstrual_2.png"),
  ],
  follicular: [
    require("../../assets/companion/follicular_1.png"),
    require("../../assets/companion/follicular_2.png"),
  ],
  ovulation: [
    require("../../assets/companion/ovulation_1.png"),
    require("../../assets/companion/ovulation_2.png"),
  ],
  luteal: [
    require("../../assets/companion/luteal_1.png"),
    require("../../assets/companion/luteal_2.png"),
  ],
  safe: [
    require("../../assets/companion/safe_1.png"),
    require("../../assets/companion/safe_2.png"),
  ],
};

const SLEEP_IMAGE = require("@/assets/companion/sleep.png");

export function CompanionMessage({ phase }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;

  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;

  const { message, image } = useMemo(() => {
    if (isNight) {
      return {
        message: "Good night… sweet dreams 🌙💤",
        image: SLEEP_IMAGE,
      };
    }

    const messages = PHASE_MESSAGES[phase];
    const images = PHASE_IMAGES[phase];

    return {
      message: messages[Math.floor(Math.random() * messages.length)],
      image: images[Math.floor(Math.random() * images.length)],
    };
  }, [phase, isNight]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fade,
          transform: [{ translateY: slide }],
        },
      ]}
    >
      <Image source={image} style={styles.avatar} />

      <LinearGradient
        colors={["#FCE7F3", "#FBCFE8"]}
        style={styles.bubble}
      >
        <Text style={styles.text}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 20,
    marginBottom: 14,
  },

  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
    shadowColor: "#EC4899",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  text: {
    fontSize: 14,
    color: "#831843",
    lineHeight: 20,
    fontWeight: "500",
  },
});
