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

import { HeaderCard } from "@/src/components/HeaderCard";
import { CycleRing } from "@/src/components/CycleRing";
import { TipsSuggester } from "@/src/components/TipsSuggester";
import { CompanionMessage } from "@/src/components/CompanionMessage";
import BleedingRow from "@/src/features/bleeding/components/BleedingRow";

import {
  DEFAULT_CYCLE_STATE,
  getCurrentCycleDay,
  getPhaseForDay,
} from "@/src/cycle/state";

const HEADER_HEIGHT = 140;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// how far the sheet collapses
const COLLAPSED_Y = HEADER_HEIGHT * 0.65;
const EXPANDED_Y = HEADER_HEIGHT + 12;

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  const translateY = useRef(new Animated.Value(EXPANDED_Y)).current;

  /* 🌫 header blur while dragging */
  const blurOpacity = translateY.interpolate({
    inputRange: [COLLAPSED_Y, EXPANDED_Y],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  /* 🖐️ drag entire page */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,

      onPanResponderMove: (_, g) => {
        const next = EXPANDED_Y + g.dy;
        if (next >= COLLAPSED_Y) {
          translateY.setValue(next);
        }
      },

      onPanResponderRelease: (_, g) => {
        Animated.spring(translateY, {
          toValue: g.dy < -80 ? COLLAPSED_Y : EXPANDED_Y,
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

        {/* header blur */}
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

      {/* 🔽 DRAGGABLE SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* small handle */}
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* 🌸 TIPS — FIXED VISIBILITY */}
          <TipsSuggester
            phase={currentPhase}
            currentDay={currentDay}
          />

          {/* 🟣 CYCLE RING */}
          <View style={styles.center}>
            <CycleRing
              cycleLength={cycleLength}
              periodLength={periodLength}
              currentDay={currentDay}
            />
          </View>

          {/* 🧍‍♀️ COMPANION */}
          <CompanionMessage
            phase={currentPhase}
            day={currentDay}
          />

          {/* 🩸 BLEEDING */}
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

  /* HEADER */
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 100,
  },

  /* DRAGGABLE PAGE */
  sheet: {
    position: "absolute",
    top: 0,
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 10,
    overflow: "hidden",
  },

  handle: {
    width: 44,
    height: 5,
    backgroundColor: "#475569",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  /* IMPORTANT FIX — paddingTop makes Tips visible */
  content: {
    paddingTop: 20,
    paddingBottom: 80, // 👈 prevents bleeding buttons cut
  },

  center: {
    alignItems: "center",
    marginVertical: 16,
  },
});
