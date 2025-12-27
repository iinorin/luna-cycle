import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { CycleDot } from "./CycleDots";
import { CyclePhase } from "../cycle/types";
import { PHASE_COLORS } from "../cycle/colors";
import { getPhaseForDay } from "../cycle/state";

type Props = {
  cycleLength: number;
  currentDay: number;
  periodLength: number;
};

const RING_SIZE = 300;          // ⬅ Bigger circle
const OUTER_RING_SIZE = 320;    // ⬅ Outline ring
const DOT_SIZE = 14;
const RADIUS = RING_SIZE / 2 - 18;

export function CycleRing({
  cycleLength,
  currentDay,
  periodLength,
}: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  // Pulse animation for today dot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      {/* Outer outline */}
      <View style={styles.outerRing} />

      {/* Main ring */}
      <View style={styles.ring}>
        {Array.from({ length: cycleLength }).map((_, index) => {
          const day = index + 1;
          const angle = (2 * Math.PI * index) / cycleLength - Math.PI / 2;

          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);

          const phase: CyclePhase = getPhaseForDay(day, periodLength);
          const isToday = day === currentDay;

          return (
            <Animated.View
              key={day}
              style={[
                styles.dotWrapper,
                {
                  transform: [
                    { translateX: x },
                    { translateY: y },
                    { scale: isToday ? pulse : 1 },
                  ],
                },
              ]}
            >
              <CycleDot
                phase={phase}
                isActive={isToday}
                size={isToday ? DOT_SIZE + 6 : DOT_SIZE}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: OUTER_RING_SIZE,
    height: OUTER_RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },

  outerRing: {
    position: "absolute",
    width: OUTER_RING_SIZE,
    height: OUTER_RING_SIZE,
    borderRadius: OUTER_RING_SIZE / 2,
    borderWidth: 2,
    borderColor: "#ffffff22",
  },

  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  dotWrapper: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
