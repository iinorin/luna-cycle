import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { getPhaseForDay } from "@/src/cycle/state";
import { PHASE_COLORS } from "@/src/cycle/colors";

type Props = {
  day: number;
  periodLength: number;
};

export function DayInfoCard({ day, periodLength }: Props) {
  const phase = getPhaseForDay(day, periodLength);
  const color = PHASE_COLORS[phase];

  // animation values
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [day]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: color,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Text style={[styles.day, { color }]}>
        Day {day}
      </Text>

      <Text style={[styles.phase, { color }]}>
        {phase} Phase
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#020617",
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1.5,
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
