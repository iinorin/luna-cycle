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

  // Separate animation values
  const appear = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const prevColor = useRef(phaseColor);

  useEffect(() => {
    // Reset
    appear.setValue(0);
    colorAnim.setValue(0);

    Animated.parallel([
      Animated.spring(appear, {
        toValue: 1,
        friction: 7,
        useNativeDriver: false, // IMPORTANT
      }),
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: false, // IMPORTANT
      }),
    ]).start();

    prevColor.current = phaseColor;
  }, [day]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor.current, phaseColor],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: animatedColor,
          shadowColor: phaseColor,
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

    // Glow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,

    // Android glow fallback
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
