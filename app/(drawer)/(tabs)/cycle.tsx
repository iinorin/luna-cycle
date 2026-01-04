import { useRef } from "react";
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

// How far the sheet moves
const COLLAPSED_Y = HEADER_HEIGHT * 0.65; // High position
const EXPANDED_Y = HEADER_HEIGHT + 12;     // Low position

// Sheet base top (place sheet below header to avoid transform stacking issues)
const SHEET_TOP = HEADER_HEIGHT;
// Translate values relative to the sheet's base `top`
// Prevent the sheet from translating up above the header by clamping the
// collapsed translate to 0 (sheet top == header bottom).
const TRANSLATED_COLLAPSED = 0;
const TRANSLATED_EXPANDED = EXPANDED_Y - SHEET_TOP;

export default function HomeScreen() {
  const cycleLength = DEFAULT_CYCLE_STATE.cycleLength;
  const periodLength = DEFAULT_CYCLE_STATE.periodLength;

  const currentDay = getCurrentCycleDay(DEFAULT_CYCLE_STATE);
  const currentPhase = getPhaseForDay(currentDay, periodLength);

  /**
   * FIX 1: TRACKING POSITION
   * lastTranslateY stores where the sheet stopped last time.
   * This prevents the sheet from "jumping" back to the start when you touch it again.
   */
  const lastTranslateY = useRef(TRANSLATED_EXPANDED);
  const translateY = useRef(new Animated.Value(TRANSLATED_EXPANDED)).current;

  /* 🌫 header blur while dragging */
  const blurOpacity = translateY.interpolate({
    inputRange: [TRANSLATED_COLLAPSED, TRANSLATED_EXPANDED],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  /* 🖐️ DRAG LOGIC */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,

      onPanResponderMove: (_, g) => {
        // Calculate new position based on where we started the drag (lastTranslateY)
        let nextPos = lastTranslateY.current + g.dy;

        // Constraint: Don't let the sheet go higher than the collapsed point
        if (nextPos < TRANSLATED_COLLAPSED) {
          nextPos = TRANSLATED_COLLAPSED;
        }

        translateY.setValue(nextPos);
      },

      onPanResponderRelease: (_, g) => {
        // Determine if we should snap Up or Down based on drag distance (80px)
        const shouldSnapUp = g.dy < -80;
        const toValue = shouldSnapUp ? TRANSLATED_COLLAPSED : TRANSLATED_EXPANDED;

        Animated.spring(translateY, {
          toValue,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start(() => {
          // FIX: Save the new position so the next drag starts from here
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
        {/* DRAG HANDLE AREA
        <View {...panResponder.panHandlers} style={styles.handleContainer}>
          <View style={styles.handle} />
        </View> */}

        {/* DRAG HANDLE AREA */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 🌸 TIPS */}
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
    zIndex: 1000,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  /* DRAGGABLE PAGE */
  sheet: {
    position: "absolute",
    top: 0,
    // Sheet must be full screen height to cover the background when dragged up
    height: SCREEN_HEIGHT,
    width: "100%",
    backgroundColor: "#0F172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    zIndex: 10,
    overflow: "hidden",
    // Shadow to distinguish sheet from header
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  handleContainer: {
    width: "100%",
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },

  handle: {
    width: 44,
    height: 5,
    backgroundColor: "#475569",
    borderRadius: 10,
  },

  /* 🚀 THE CRITICAL FIX FOR CUTOFF CONTENT */
  scrollContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
    // paddingBottom must be equal to or greater than your EXPANDED_Y (152px)
    // plus some extra for the BleedingRow components.
    paddingBottom: EXPANDED_Y + 150,
  },

  center: {
    alignItems: "center",
    marginVertical: 16,
  },
});