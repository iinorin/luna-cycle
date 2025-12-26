import { View } from "react-native";

type Dot = {
  color: string;
  isActive?: boolean;
};

type Props = {
  dots: Dot[];
};

export function CycleDots({ dots }: Props) {
  const radius = 120;
  const dotSize = 10;

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        position: "relative",
      }}
    >
      {dots.map((dot, index) => {
        const angle = (2 * Math.PI * index) / dots.length;

        const x =
          radius + radius * Math.cos(angle) - dotSize / 2;
        const y =
          radius + radius * Math.sin(angle) - dotSize / 2;

        return (
          <View
            key={index}
            style={{
              position: "absolute",
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: dot.color,
              left: x,
              top: y,
              opacity: dot.isActive ? 1 : 0.5,
            }}
          />
        );
      })}
    </View>
  );
}
