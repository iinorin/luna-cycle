import { View } from "react-native";
import { CyclePhase } from "../cycle/types";
import { PHASE_COLORS } from "../cycle/colors";

type Props = {
  phase: CyclePhase;
  isActive: boolean;
  size?: number;
};

export function CycleDot({ phase, isActive, size = 14 }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: PHASE_COLORS[phase],
        borderWidth: isActive ? 2 : 0,
        borderColor: "#fff",
      }}
    />
  );
}
