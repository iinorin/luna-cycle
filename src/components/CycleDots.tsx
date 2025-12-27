import { Animated, Pressable } from "react-native";
import { useEffect, useRef } from "react";
import { getPhaseColor } from "../cycle/colors";
import { CyclePhase } from "../cycle/types";

type Props = {
  index: number;
  angle: number;
  phase: CyclePhase;
  isActive: boolean;
  onPress: () => void;
};

export function CycleDot({ index, angle, phase, isActive, onPress }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [phase]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        transform: [
          { rotate: `${angle}deg` },
          { translateY: -120 },
          { scale },
        ],
      }}
    >
      <Pressable onPress={onPress}>
        <Animated.View
          style={{
            width: isActive ? 10 : 8,
            height: isActive ? 10 : 8,
            borderRadius: 5,
            backgroundColor: getPhaseColor(phase),
            opacity: isActive ? 1 : 0.6,
          }}
        />
      </Pressable>
    </Animated.View>
  );
}
