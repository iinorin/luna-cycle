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
const COLLAPSED_Y = HEADER_HEIGHT * 0.6;
const EXPANDED_Y = HEADER_HEIGHT;

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  const translateY = useRef(new Animated.Value(EXPANDED_Y)).current;

  /* header blur */
  const blurOpacity = translateY.interpolate({
    inputRange: [COLLAPSED_Y, EXPANDED_Y],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  /* 🖐️ page drag */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,

      onPanResponderMove: (_, g) => {
        const next = EXPANDED_Y + g.dy;
        if (next >= COLLAPSED_Y) translateY.setValue(next);
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

        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
        >
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>

      {/* 🔽 DRAGGABLE PAGE (EVERYTHING BELOW HEADER) */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.page,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <TipsSuggester phase={currentPhase} currentDay={currentDay} />

          <View style={styles.center}>
            <CycleRing
              cycleLength={cycleLength}
              periodLength={periodLength}
              currentDay={currentDay}
            />
          </View>

          <CompanionMessage phase={currentPhase} day={currentDay} />

          {/* 🩸 BLEEDING ROW MOVES WITH PAGE */}
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
  },

  page: {
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

  content: {
    paddingBottom: 40,
  },

  center: {
    alignItems: "center",
  },
});
