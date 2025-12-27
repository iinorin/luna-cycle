import { View, StyleSheet } from "react-native";
import { generateCycleUI } from "../cycle/state";

const RADIUS = 120;
const DOT_SIZE = 10;

export function CycleRing() {
  const cycleDays = generateCycleUI();

  return (
    <View style={styles.container}>
      {cycleDays.map((dayData, index) => {
        const angle = (2 * Math.PI * index) / cycleDays.length;

        const x = RADIUS * Math.cos(angle);
        const y = RADIUS * Math.sin(angle);

        return (
          <View
            key={dayData.day}
            style={[
              styles.dot,
              {
                backgroundColor: dayData.color,
                transform: [
                  { translateX: x },
                  { translateY: y },
                  { scale: dayData.isToday ? 1.4 : 1 },
                ],
                opacity: dayData.isSafe ? 0.4 : 1,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RADIUS * 2 + 30,
    height: RADIUS * 2 + 30,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
