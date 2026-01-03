import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { PHASE_GRADIENTS } from "../cycle/colors";
import { CyclePhase } from "../cycle/types";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type HeaderCardProps = {
  phase: CyclePhase;
  dragY: Animated.Value; // 👈 NEW
};

export function HeaderCard({ phase, dragY }: HeaderCardProps) {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 🔮 Blur intensity increases as user drags down
  const blurIntensity = dragY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 40],
    extrapolate: "clamp",
  });

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
      {/* 🌫️ BLUR LAYER */}
      <AnimatedBlurView
        intensity={blurIntensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={PHASE_GRADIENTS[phase]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Hamburger */}
        <Pressable
          style={styles.menuBtn}
          onPress={() => navigation.dispatch({ type: "OPEN_DRAWER" })}
        >
          <Ionicons name="menu" size={26} color="#fff" />
        </Pressable>

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Luna Cycle</Text>
          <Text style={styles.phase}>{phase.toUpperCase()} PHASE</Text>
          <View style={styles.indicator} />
        </View>

        <View style={{ width: 40 }} />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },

  header: {
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  menuBtn: {
    width: 40,
    justifyContent: "center",
  },

  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },

  phase: {
    marginTop: 6,
    fontSize: 13,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.85)",
  },

  indicator: {
    marginTop: 10,
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
