import { View, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { CyclePhase } from "../cycle/types";
import { PHASE_COLORS } from "../cycle/colors";

type Props = {
  phase: CyclePhase;
  isActive: boolean;
  size?: number;
};

export function CycleDot({ phase, isActive, size = 16 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: PHASE_COLORS[phase],
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}
