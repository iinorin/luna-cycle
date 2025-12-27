import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";

export function HeaderCard({ phase = "LUTEAL PHASE" }) {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Hamburger */}
      <Pressable
        style={styles.menuBtn}
        onPress={() => navigation.dispatch({ type: "OPEN_DRAWER" })}
      >
        <Ionicons name="menu" size={26} color="#fff" />
      </Pressable>

      {/* Title */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Luna Cycle</Text>
        <Text style={styles.phase}>{phase}</Text>
        <View style={styles.indicator} />
      </View>

      {/* Spacer to keep title centered */}
      <View style={{ width: 40 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#A855F7",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  menuBtn: {
    width: 40,
    justifyContent: "center",
  },

  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },

  phase: {
    marginTop: 6,
    fontSize: 13,
    letterSpacing: 2,
    color: "rgba(255,255,255,0.85)",
  },

  indicator: {
    marginTop: 10,
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
