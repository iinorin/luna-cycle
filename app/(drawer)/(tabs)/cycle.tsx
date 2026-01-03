import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
} from "react-native";
import { useRef } from "react";
import { BlurView } from "expo-blur";

import { HeaderCard } from "@/src/components/HeaderCard";
import { CycleRing } from "@/src/components/CycleRing";

import {
  DEFAULT_CYCLE_STATE,
  getCurrentCycleDay,
  getPhaseForDay,
} from "@/src/cycle/state";

import BleedingRow from "@/src/features/bleeding/components/BleedingRow";

const HEADER_HEIGHT = 140;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MIN_SHEET_Y = HEADER_HEIGHT * 0.55;

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  const translateY = useRef(new Animated.Value(HEADER_HEIGHT)).current;

  /* 🔵 Ring scale */
  const ringScale = translateY.interpolate({
    inputRange: [MIN_SHEET_Y, HEADER_HEIGHT],
    outputRange: [0.9, 1],
    extrapolate: "clamp",
  });

  /* 🌫️ Blur fade (opacity, NOT intensity) */
  const blurOpacity = translateY.interpolate({
    inputRange: [MIN_SHEET_Y, HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,

      onPanResponderMove: (_, g) => {
        const nextY = HEADER_HEIGHT + g.dy;
        if (nextY >= MIN_SHEET_Y) {
          translateY.setValue(nextY);
        }
      },

      onPanResponderRelease: (_, g) => {
        Animated.spring(translateY, {
          toValue: g.dy < -80 ? MIN_SHEET_Y : HEADER_HEIGHT,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* 🔒 FIXED HEADER */}
      <View style={styles.header}>
        <HeaderCard phase={currentPhase} />

        {/* 🌫️ BLUR OVERLAY (opacity animated) */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
        >
          <BlurView
            intensity={70}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* ⬆️ DRAGGABLE SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* handle */}
        <View style={styles.handle} />

        {/* 🔵 SCALED RING */}
        <Animated.View style={{ transform: [{ scale: ringScale }] }}>
          <View style={styles.ringContainer}>
            <CycleRing
              cycleLength={cycleLength}
              periodLength={periodLength}
              currentDay={currentDay}
            />
          </View>
        </Animated.View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BleedingRow
            day={currentDay}
            isPeriodDay={currentDay <= periodLength}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
    overflow: "hidden",
  },

  sheet: {
    position: "absolute",
    top: 0,
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 10,
  },

  handle: {
    width: 42,
    height: 5,
    backgroundColor: "#475569",
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 10,
  },

  ringContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
});
