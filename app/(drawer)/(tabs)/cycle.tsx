import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
} from "react-native";
import { useRef } from "react";

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

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  const translateY = useRef(new Animated.Value(HEADER_HEIGHT)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,

      onPanResponderMove: (_, g) => {
        const nextY = HEADER_HEIGHT + g.dy;
        if (nextY >= HEADER_HEIGHT * 0.5) {
          translateY.setValue(nextY);
        }
      },

      onPanResponderRelease: (_, g) => {
        Animated.spring(translateY, {
          toValue: g.dy < -80 ? HEADER_HEIGHT * 0.5 : HEADER_HEIGHT,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* FIXED HEADER */}
      <View style={styles.header}>
        <HeaderCard phase={currentPhase} />
      </View>

      {/* DRAGGABLE SHEET */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* drag handle */}
        <View style={styles.handle} />

        {/* CYCLE RING */}
        <View style={styles.ringContainer}>
          <CycleRing
            cycleLength={cycleLength}
            periodLength={periodLength}
            currentDay={currentDay}
          />
        </View>

        {/* SCROLLABLE CONTENT */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BleedingRow
            day={currentDay}
            isPeriodDay={currentDay <= periodLength}
          />

          {/* future content */}
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
