import { BlurView } from "expo-blur";
import { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { CycleRing } from "@/src/components/CycleRing";
import { HeaderCard } from "@/src/components/HeaderCard";
import { TipsSuggester } from "@/src/components/TipsSuggester";
import { CompanionMessage } from "@/src/components/CompanionMessage";

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

  /* 🧩 Content scale */
  const contentScale = translateY.interpolate({
    inputRange: [MIN_SHEET_Y, HEADER_HEIGHT],
    outputRange: [0.96, 1],
    extrapolate: "clamp",
  });

  /* 🌫️ Blur fade */
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
        <HeaderCard phase={currentPhase} translateY={translateY} />

        {/* 🌫️ BLUR OVERLAY */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
        >
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>

      {/* ⬆️ DRAGGABLE SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* 🌸 PHASE TIPS */}
        <Animated.View
          style={[styles.tipsContainer, { transform: [{ scale: contentScale }] }]}
        >
          <TipsSuggester phase={currentPhase} currentDay={currentDay} />
        </Animated.View>

        {/* 🔵 CYCLE RING */}
        <Animated.View style={{ transform: [{ scale: ringScale }] }}>
          <View style={styles.ringContainer}>
            <CycleRing
              cycleLength={cycleLength}
              periodLength={periodLength}
              currentDay={currentDay}
            />
          </View>
        </Animated.View>

        {/* 👧 COMPANION MESSAGE */}
        <Animated.View
          style={[styles.companionWrapper, { transform: [{ scale: contentScale }] }]}
        >
          <CompanionMessage phase={currentPhase} />
        </Animated.View>

        {/* CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={{ transform: [{ scale: contentScale }] }}>
            <BleedingRow
              day={currentDay}
              isPeriodDay={currentDay <= periodLength}
            />
          </Animated.View>
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

  tipsContainer: {
    marginBottom: 6,
  },

  ringContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  companionWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
});
