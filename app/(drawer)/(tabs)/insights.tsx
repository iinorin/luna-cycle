import { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import {
  LineChart,
  PieChart,
  BarChart,
} from "react-native-chart-kit";
import { useFocusEffect } from "expo-router";

import { getCycleData, CycleData } from "@/src/features/track-period/storage";
import { calculateCycleInfo } from "@/src/cycle/calculations";

import {
  getBleedingStore,
} from "@/src/features/bleeding/storage";


import {
  groupByMonth,
  getMonthlyPieData,
  getMonthlyBarValue,
} from "@/src/features/bleeding/utils";


const screenWidth = Dimensions.get("window").width;

export default function InsightsScreen() {
  const [cycle, setCycle] = useState<CycleData | null>(null);
  const [cycleInfo, setCycleInfo] = useState<any>(null);
  const [bleedingStore, setBleedingStore] = useState<any>({});

  const progressAnim = useRef(new Animated.Value(0)).current;

  /**
   * 🔄 Refresh every time screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    const data = await getCycleData();
    const bleeding = await getBleedingStore();

    console.log("🩸 Bleeding data loaded in Insights:", bleeding);

    if (!data) {
      setCycle(null);
      setCycleInfo(null);
      return;
    }

    const info = calculateCycleInfo(data);
    setCycle(data);
    setCycleInfo(info);
    setBleedingStore(bleeding);

    progressAnim.setValue(0);
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

  /** Existing graph data */
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

  const lutealStartDay = cycle.cycleLength - 6; // last 7 days

const currentPhase =
  cycleInfo.cycleDay <= cycle.periodDuration
    ? "🌸 Menstrual Phase — Rest & recharge"
    : cycleInfo.cycleDay < cycleInfo.fertileWindow.startDay
      ? "🌱 Follicular Phase — Energy rising"
      : cycleInfo.cycleDay <= cycleInfo.fertileWindow.endDay
        ? "🔥 Ovulation Phase — Peak confidence"
        : cycleInfo.cycleDay < lutealStartDay
          ? "🛡️ Safe Phase — Calm & balanced"
          : "🌙 Luteal Phase — Slow & reflect";


  /* =========================
     🩸 BLEEDING INSIGHTS DATA
     ========================= */

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthData = bleedingStore[currentMonth] || {};

  const pieCounts = getMonthlyPieData(currentMonthData);

  const pieData = [
    { name: "None", count: pieCounts[0], color: "#e5e7eb" },
    { name: "Light", count: pieCounts[1], color: "#fecdd3" },
    { name: "Medium", count: pieCounts[2], color: "#fb7185" },
    { name: "Heavy", count: pieCounts[3], color: "#e11d48" },
  ].filter((d) => d.count > 0);

  const months = Object.keys(bleedingStore).sort();
  const barScores = months.map((m) =>
    getMonthlyBarValue(bleedingStore[m])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ===== ORIGINAL CONTENT (UNCHANGED) ===== */}

      <Text style={styles.title}>📊 Cycle Insights</Text>
      <Text style={styles.subtitle}>
        Understanding your rhythm ✨
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌀 Cycle Progress</Text>
        <Text style={styles.value}>
          Day {cycleInfo.cycleDay} of {cycle.cycleLength}
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

      <View style={styles.infoRow}>
        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>🩸 Next Period</Text>
          <Text style={styles.value}>
            {cycleInfo.nextPeriod.toDateString()}
          </Text>
        </View>

        <View style={[styles.card, styles.halfCard]}>
          <Text style={styles.cardTitle}>🔥 Fertile Window</Text>
          <Text style={styles.value}>
            Day {cycleInfo.fertileWindow.startDay} –{" "}
            {cycleInfo.fertileWindow.endDay}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Cycle Overview</Text>

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

      <View style={[styles.card, styles.softCard]}>
        <Text style={styles.cardTitle}>💫 Current Phase</Text>
        <Text style={styles.phaseText}>{currentPhase}</Text>
      </View>

      <View style={[styles.card, styles.softCard]}>
        <Text style={styles.cardTitle}>🕒 Cycle History</Text>
        <Text style={styles.meta}>
          Created:{" "}
          {cycle.createdAt
            ? new Date(cycle.createdAt).toDateString()
            : "—"}
        </Text>
        <Text style={styles.meta}>
          Last Updated:{" "}
          {cycle.updatedAt
            ? new Date(cycle.updatedAt).toDateString()
            : "—"}
        </Text>
      </View>

      {/* ===== 🩸 NEW BLEEDING INSIGHTS (ADDED BELOW) ===== */}

      <Text style={styles.sectionTitle}>🩸 Bleeding Insights</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Bleeding Distribution (This Month)
        </Text>

        {pieData.length ? (
          <PieChart
            data={pieData.map((d) => ({
              name: d.name,
              population: d.count,
              color: d.color,
              legendFontColor: "#374151",
              legendFontSize: 12,
            }))}
            width={screenWidth - 48}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={{ color: () => "#000" }}
          />
        ) : (
          <Text style={styles.emptyText}>
            No bleeding data for this month
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Monthly Bleeding Overview
        </Text>

        {barScores.length ? (
          <BarChart
            data={{
              labels: months,
              datasets: [{ data: barScores }],
            }}
            width={screenWidth - 48}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: "#0F172A",
              backgroundGradientTo: "#020617",
              decimalPlaces: 1,
              color: (o = 1) => `rgba(244, 63, 94, ${o})`,
              labelColor: () => "#E5E7EB",
            }}
            style={{ borderRadius: 16 }}
          />

        ) : (
          <Text style={styles.emptyText}>
            No monthly bleeding data yet
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12002b",
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  scrollContent: {
    paddingBottom: 40,
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

  emptyText: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
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

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginVertical: 16,
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

  meta: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 4,
  },
});
