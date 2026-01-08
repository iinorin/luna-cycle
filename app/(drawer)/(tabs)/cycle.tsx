import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { CompanionMessage } from "@/src/components/CompanionMessage";
import { CycleRing } from "@/src/components/CycleRing";
import { HeaderCard } from "@/src/components/HeaderCard";
import { TipsSuggester } from "@/src/components/TipsSuggester";
import BleedingRow from "@/src/features/bleeding/components/BleedingRow";

import {
  DEFAULT_CYCLE_STATE,
  getCurrentCycleDay,
  getPhaseForDay,
} from "@/src/cycle/state";

const HEADER_HEIGHT = 140;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const EXPANDED_Y = HEADER_HEIGHT + 12;
const SHEET_TOP = HEADER_HEIGHT;
const TRANSLATED_COLLAPSED = 0;
const TRANSLATED_EXPANDED = EXPANDED_Y - SHEET_TOP;

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  const lastTranslateY = useRef(TRANSLATED_EXPANDED);
  const translateY = useRef(new Animated.Value(TRANSLATED_EXPANDED)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        let nextPos = lastTranslateY.current + g.dy;
        if (nextPos < TRANSLATED_COLLAPSED) nextPos = TRANSLATED_COLLAPSED;
        translateY.setValue(nextPos);
      },
      onPanResponderRelease: (_, g) => {
        const shouldSnapUp = g.dy < -80;
        const toValue = shouldSnapUp
          ? TRANSLATED_COLLAPSED
          : TRANSLATED_EXPANDED;

        Animated.spring(translateY, {
          toValue,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start(() => {
          lastTranslateY.current = toValue;
        });
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* 🔒 FIXED HEADER */}
      <View style={styles.header}>
        <HeaderCard phase={currentPhase} translateY={translateY} />
      </View>

      {/* 🔽 DRAGGABLE SHEET */}
      <Animated.View
        style={[
          styles.sheet,
          {
            top: SHEET_TOP,
            transform: [{ translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 🌸 TIPS */}
          <TipsSuggester phase={currentPhase} currentDay={currentDay} />

          {/* 🟣 CYCLE RING */}
          <View style={styles.center}>
            <CycleRing
              cycleLength={cycleLength}
              periodLength={periodLength}
              currentDay={currentDay}
            />
          </View>

          {/* 🧍‍♀️ COMPANION */}
          <CompanionMessage phase={currentPhase} day={currentDay} />

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
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 10,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  handleContainer: {
    width: "100%",
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#475569",
    borderRadius: 10,
  },
  scrollContent: {
    paddingTop: 4,
    paddingHorizontal: 14,
    paddingBottom: EXPANDED_Y + 100,
  },
  center: {
    alignItems: "center",
    marginVertical: 10,
  },
});
