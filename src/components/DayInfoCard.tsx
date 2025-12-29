import { useEffect, useRef } from "react";
import {
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { getPhaseForDay } from "@/src/cycle/state";
import { PHASE_COLORS } from "@/src/cycle/colors";

type Props = {
  day: number;
  periodLength: number;
};

export function DayInfoCard({ day, periodLength }: Props) {
  const phase = getPhaseForDay(day, periodLength);
  const phaseColor = PHASE_COLORS[phase];

  // animations
  const appear = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  const prevColor = useRef(phaseColor);

  useEffect(() => {
    // reset values
    appear.setValue(0);
    colorAnim.setValue(0);
    glowPulse.setValue(0);

    Animated.parallel([
      // card entry
      Animated.spring(appear, {
        toValue: 1,
        friction: 7,
        useNativeDriver: false,
      }),

      // color transition
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: false,
      }),

      // glow pulse (one-shot)
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 220,
          useNativeDriver: false,
        }),
        Animated.timing(glowPulse, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    prevColor.current = phaseColor;
  }, [day]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor.current, phaseColor],
  });

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.6],
  });

  const glowRadius = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 18],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: animatedColor,
          shadowColor: phaseColor,
          shadowOpacity: glowOpacity,
          shadowRadius: glowRadius,
          opacity: appear,
          transform: [
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
            {
              scale: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Animated.Text
        style={[styles.day, { color: animatedColor }]}
      >
        Day {day}
      </Animated.Text>

      <Animated.Text
        style={[styles.phase, { color: animatedColor }]}
      >
        {phase} Phase
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: "#020617",
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,

    shadowOffset: { width: 0, height: 6 },

    elevation: Platform.OS === "android" ? 6 : 0,
  },
  day: {
    fontSize: 14,
    fontWeight: "500",
  },
  phase: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
  },
});
