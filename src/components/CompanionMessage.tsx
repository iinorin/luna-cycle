import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CyclePhase } from "@/src/cycle/types";

type Props = {
  phase: CyclePhase;
};

const PHASE_MESSAGES: Record<CyclePhase, string[]> = {
  menstrual: [
    "Hey… how are you feeling today? 🩸💗",
    "It’s okay to slow down today 🌧️",
    "I’m right here with you 🤍",
  ],
  follicular: [
    "You seem lighter today 🌱",
    "Feeling a little more like yourself?",
    "Want to plan something fun? ✨",
  ],
  ovulation: [
    "You’re glowing today ✨",
    "Feeling confident? I can feel it 💕",
    "Smile — today suits you 🌸",
  ],
  safe: [
    "Everything feels balanced today 🌿",
    "You’re doing just fine 🤍",
    "Let’s keep this calm energy 🫶",
  ],
  luteal: [
    "Hey… don’t be too hard on yourself 🌙",
    "Your feelings are valid 🤍",
    "I know things feel heavy sometimes 💭",
  ],
};

export function CompanionMessage({ phase }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;

  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;

  const message = useMemo(() => {
    if (isNight) return "Good night… sweet dreams 🌙💤";
    const list = PHASE_MESSAGES[phase];
    return list[Math.floor(Math.random() * list.length)];
  }, [phase, isNight]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
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
      {/* Girl image (replace with your assets later) */}
      <Image
        source={require("@/assets/companion/girl_idle.png")}
        style={styles.avatar}
      />

      {/* Speech bubble */}
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
    width: 48,
    height: 48,
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  text: {
    fontSize: 14,
    color: "#831843",
    lineHeight: 20,
    fontWeight: "500",
  },
});
