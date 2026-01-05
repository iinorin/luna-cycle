import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle2, AlertTriangle } from "lucide-react-native";

export default function PainScreen() {
  const [selected, setSelected] = useState<"none" | "pain" | null>(null);

  const scaleNoPain = useRef(new Animated.Value(1)).current;
  const scalePain = useRef(new Animated.Value(1)).current;

  const animatePress = (scale: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      {/* Header Card */}
      <LinearGradient
        colors={["#fbc2eb", "#a6c1ee"]}
        style={styles.headerCard}
      >
        <Text style={styles.headerTitle}>Pain Today</Text>
        <Text style={styles.headerSubtitle}>
          Tell us how you're feeling right now
        </Text>
      </LinearGradient>

      {/* Icon Buttons */}
      <View style={styles.iconRow}>
        {/* No Pain */}
        <Pressable
          onPress={() => {
            setSelected("none");
            animatePress(scaleNoPain);
          }}
        >
          <Animated.View
            style={[
              styles.iconWrapper,
              selected === "none" && styles.activeNoPain,
              { transform: [{ scale: scaleNoPain }] },
            ]}
          >
            <CheckCircle2
              size={48}
              color={selected === "none" ? "#0f5132" : "#4b5563"}
            />
            <Text
              style={[
                styles.iconLabel,
                selected === "none" && styles.activeLabel,
              ]}
            >
              No Pain
            </Text>
          </Animated.View>
        </Pressable>

        {/* Pain */}
        <Pressable
          onPress={() => {
            setSelected("pain");
            animatePress(scalePain);
          }}
        >
          <Animated.View
            style={[
              styles.iconWrapper,
              selected === "pain" && styles.activePain,
              { transform: [{ scale: scalePain }] },
            ]}
          >
            <AlertTriangle
              size={48}
              color={selected === "pain" ? "#842029" : "#4b5563"}
            />
            <Text
              style={[
                styles.iconLabel,
                selected === "pain" && styles.activeLabel,
              ]}
            >
              Pain
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },

  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    marginTop: 100,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },

  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#374151",
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  iconWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  iconLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },

  activeNoPain: {
    backgroundColor: "#d1fae5",
  },

  activePain: {
    backgroundColor: "#fee2e2",
  },

  activeLabel: {
    color: "#111827",
  },
});
