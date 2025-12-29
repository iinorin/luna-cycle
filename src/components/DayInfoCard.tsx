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

  // animation values
  const appear = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  // keep previous color
  const prevColor = useRef(phaseColor);

  useEffect(() => {
    // appear animation
    Animated.spring(appear, {
      toValue: 1,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // color transition
    colorAnim.setValue(0);
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 260,
      useNativeDriver: false, // color interpolation
    }).start();

    prevColor.current = phaseColor;
  }, [day]);

  // animated colors
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
          transform: [
            {
              translateY: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
            {
              scale: appear.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
          ],
          opacity: appear,
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

    // Android glow
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
