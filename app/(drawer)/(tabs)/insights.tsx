import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import { getCycleData, CycleData } from "@/src/features/track-period/storage";
import { calculateCycleInfo } from "@/src/cycle/calculations";

const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [cycle, setCycle] = useState<CycleData | null>(null);
  const [cycleInfo, setCycleInfo] = useState<any>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getCycleData();
    if (!data) return;

    const info = calculateCycleInfo(data);
    setCycle(data);
    setCycleInfo(info);

    Animated.timing(progressAnim, {
      toValue: info.cycleDay / data.cycleLength,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }

  if (!cycle || !cycleInfo) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No cycle data yet 🌸</Text>
      </View>
    );
  }

  /** Graph data */
  const days = Array.from(
    { length: cycle.cycleLength },
    (_, i) => i + 1
  );

  const phaseData = days.map((day) => {
    if (day <= cycle.periodDuration) return 2;
    if (
      day >= cycleInfo.fertileWindow.startDay &&
      day <= cycleInfo.fertileWindow.endDay
    )
      return 7;
    if (day === cycleInfo.ovulationDay) return 9;
    return 5;
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  /** Current phase text */
  const currentPhase =
    cycleInfo.cycleDay <= cycle.periodDuration
      ? "🌸 Menstrual Phase — Rest & recharge"
      : cycleInfo.cycleDay <
        cycleInfo.fertileWindow.startDay
      ? "🌱 Follicular Phase — Energy rising"
      : cycleInfo.cycleDay <=
        cycleInfo.fertileWindow.endDay
      ? "🔥 Ovulation Phase — Peak confidence"
      : "🌙 Luteal Phase — Slow & reflect";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>📊 Cycle Insights</Text>
      <Text style={styles.subtitle}>
        Understanding your rhythm ✨
      </Text>

      {/* PROGRESS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌀 Cycle Progress</Text>

        <Text style={styles.value}>
          Day {cycleInfo.cycleDay} of{" "}
          {cycle.cycleLength}
        </Text>

        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressWidth },
            ]}
          />
        </View>
      </View>

      {/* INFO ROW */}
      <View style={styles.infoRow}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>
            🩸 Next Period
          </Text>
          <Text style={styles.value}>
            {cycleInfo.nextPeriod.toDateString()}
          </Text>
        </View>

        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>
            🔥 Fertile Window
          </Text>
          <Text style={styles.value}>
            Day {cycleInfo.fertileWindow.startDay} –{" "}
            {cycleInfo.fertileWindow.endDay}
          </Text>
        </View>
      </View>

      {/* GRAPH */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          📈 Cycle Overview
        </Text>

        <LineChart
          data={{
            labels: days
              .filter((d) => d % 5 === 0)
              .map(String),
            datasets: [{ data: phaseData }],
          }}
          width={screenWidth - 48}
          height={210}
          bezier
          chartConfig={{
            backgroundGradientFrom: "#fdf2f8",
            backgroundGradientTo: "#fae8ff",
            decimalPlaces: 0,
            color: (opacity = 1) =>
              `rgba(236, 72, 153, ${opacity})`,
            labelColor: () => "#6b7280",
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ec4899",
            },
          }}
          style={styles.chart}
        />

        <Text style={styles.legend}>
          🌸 Period • 🔥 Fertile • ⭐ Ovulation
        </Text>
      </View>

      {/* CURRENT PHASE CARD */}
      <View style={[styles.card, styles.softCard]}>
        <Text style={styles.cardTitle}>
          💫 Current Phase
        </Text>
        <Text style={styles.phaseText}>
          {currentPhase}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#12002b",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12002b",
  },

  empty: {
    color: "#d8b4fe",
    fontSize: 15,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    color: "#e9d5ff",
    marginBottom: 22,
    fontSize: 14,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  halfCard: {
    width: "48%",
    backgroundColor: "#fdf4ff",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  softCard: {
    backgroundColor: "#fdf4ff",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6b21a8",
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  progressTrack: {
    height: 9,
    backgroundColor: "#ede9fe",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#ec4899",
  },

  chart: {
    borderRadius: 16,
    marginTop: 8,
  },

  legend: {
    marginTop: 10,
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },

  phaseText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4c1d95",
  },
});
